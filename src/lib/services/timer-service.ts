/**
 * TimeFlow Pro Timer Service
 * 
 * Comprehensive timer service providing:
 * - Persistent timer state with localStorage and IndexedDB backup
 * - Accuracy validation and drift compensation
 * - Session recovery after browser crashes
 * - Performance monitoring and optimization
 * 
 * @example
 * ```typescript
 * import { timerService } from '$lib/services/timer-service';
 * 
 * // Initialize service
 * await timerService.initialize();
 * 
 * // Start timer with persistence
 * await timerService.startTimer({ projectId: '123', taskId: '456' });
 * 
 * // Check accuracy
 * const metrics = timerService.getAccuracyMetrics();
 * ```
 */

import type { 
	TimerState, 
	TimerPersistenceState, 
	TimerAccuracyMetrics,
	TimerStatus 
} from '$lib/types/timer.js';
import { eventBus } from '$lib/utils/eventBus.js';
import { getCurrentTimestamp } from '$lib/utils/dateUtils.js';

// Constants
const STORAGE_KEY = 'timeflow-timer-state';
const BACKUP_DB_NAME = 'TimeFlowPro';
const BACKUP_STORE_NAME = 'timer-backup';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds
const ACCURACY_CHECK_INTERVAL = 30000; // 30 seconds
const MAX_DRIFT_SECONDS = 2; // Maximum acceptable drift

class TimerService {
	private db: IDBDatabase | null = null;
	private autoSaveInterval: number | null = null;
	private accuracyCheckInterval: number | null = null;
	private sessionId: string;
	private initialized = false;

	constructor() {
		this.sessionId = this.generateSessionId();
	}

	/**
	 * Initialize the timer service
	 */
	async initialize(): Promise<void> {
		if (this.initialized) return;

		try {
			// Initialize IndexedDB backup
			await this.initializeIndexedDB();
			
			// Start auto-save and accuracy monitoring
			this.startAutoSave();
			this.startAccuracyMonitoring();
			
			// Attempt session recovery
			await this.recoverSession();
			
			this.initialized = true;
			console.log('Timer service initialized successfully');
		} catch (error) {
			console.error('Failed to initialize timer service:', error);
			// Continue without IndexedDB if it fails
			this.initialized = true;
		}
	}

	/**
	 * Save timer state to localStorage and IndexedDB
	 */
	async saveState(state: TimerState): Promise<void> {
		const persistenceState: TimerPersistenceState = {
			state,
			lastSaved: new Date(),
			recovery: {
				sessionId: this.sessionId,
				lastAccurateTime: new Date(),
				performanceTimestamp: performance.now()
			}
		};

		try {
			// Save to localStorage (primary)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(persistenceState));
			
			// Backup to IndexedDB (secondary)
			if (this.db) {
				await this.saveToIndexedDB(persistenceState);
			}
		} catch (error) {
			console.error('Failed to save timer state:', error);
			eventBus.emit('timer:save-error', { error, timestamp: new Date() });
		}
	}

	/**
	 * Load timer state from storage
	 */
	async loadState(): Promise<TimerPersistenceState | null> {
		try {
			// Try localStorage first
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				// Convert date strings back to Date objects
				return this.deserializePersistenceState(parsed);
			}

			// Fallback to IndexedDB
			if (this.db) {
				return await this.loadFromIndexedDB();
			}

			return null;
		} catch (error) {
			console.error('Failed to load timer state:', error);
			return null;
		}
	}

	/**
	 * Recover timer session after browser crash or refresh
	 */
	async recoverSession(): Promise<boolean> {
		const persistedState = await this.loadState();
		if (!persistedState) return false;

		const { state, recovery } = persistedState;
		
		// Check if this is the same session
		if (recovery.sessionId === this.sessionId) {
			return false; // Same session, no recovery needed
		}

		// Check if timer was running when session ended
		if (state.status === 'running' && state.startTime) {
			const now = new Date();
			const sessionGap = now.getTime() - recovery.lastAccurateTime.getTime();
			
			// If gap is reasonable (< 1 hour), attempt recovery
			if (sessionGap < 3600000) {
				eventBus.emit('timer:session-recovered', {
					previousSession: recovery.sessionId,
					gapDuration: Math.floor(sessionGap / 1000),
					timestamp: now
				});
				return true;
			}
		}

		return false;
	}

	/**
	 * Validate timer accuracy and detect drift
	 */
	getAccuracyMetrics(currentState: TimerState): TimerAccuracyMetrics {
		if (!currentState.startTime || currentState.status !== 'running') {
			return {
				expectedElapsed: 0,
				actualElapsed: currentState.elapsedTime,
				drift: 0,
				isAccurate: true,
				lastCheck: new Date()
			};
		}

		const now = new Date();
		const expectedElapsed = Math.floor((now.getTime() - currentState.startTime.getTime()) / 1000);
		const actualElapsed = currentState.elapsedTime;
		const drift = actualElapsed - expectedElapsed;

		const metrics: TimerAccuracyMetrics = {
			expectedElapsed,
			actualElapsed,
			drift,
			isAccurate: Math.abs(drift) <= MAX_DRIFT_SECONDS,
			lastCheck: now
		};

		// Emit warning if drift is significant
		if (!metrics.isAccurate) {
			eventBus.emit('timer:accuracy-warning', {
				drift,
				timestamp: now
			});
		}

		return metrics;
	}

	/**
	 * Compensate for timer drift
	 */
	compensateDrift(currentState: TimerState, drift: number): TimerState {
		if (Math.abs(drift) <= MAX_DRIFT_SECONDS) {
			return currentState; // No compensation needed
		}

		return {
			...currentState,
			elapsedTime: currentState.elapsedTime - drift
		};
	}

	/**
	 * Clean up service resources
	 */
	cleanup(): void {
		if (this.autoSaveInterval) {
			clearInterval(this.autoSaveInterval);
			this.autoSaveInterval = null;
		}

		if (this.accuracyCheckInterval) {
			clearInterval(this.accuracyCheckInterval);
			this.accuracyCheckInterval = null;
		}

		if (this.db) {
			this.db.close();
			this.db = null;
		}

		this.initialized = false;
	}

	// Private methods

	private generateSessionId(): string {
		return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	private async initializeIndexedDB(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(BACKUP_DB_NAME, 1);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(BACKUP_STORE_NAME)) {
					db.createObjectStore(BACKUP_STORE_NAME, { keyPath: 'id' });
				}
			};
		});
	}

	private async saveToIndexedDB(state: TimerPersistenceState): Promise<void> {
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([BACKUP_STORE_NAME], 'readwrite');
			const store = transaction.objectStore(BACKUP_STORE_NAME);
			
			const request = store.put({
				id: 'current-timer-state',
				...state,
				timestamp: Date.now()
			});

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	private async loadFromIndexedDB(): Promise<TimerPersistenceState | null> {
		if (!this.db) return null;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([BACKUP_STORE_NAME], 'readonly');
			const store = transaction.objectStore(BACKUP_STORE_NAME);
			const request = store.get('current-timer-state');

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const result = request.result;
				if (result) {
					const { id, timestamp, ...persistenceState } = result;
					resolve(this.deserializePersistenceState(persistenceState));
				} else {
					resolve(null);
				}
			};
		});
	}

	private deserializePersistenceState(data: any): TimerPersistenceState {
		return {
			...data,
			lastSaved: new Date(data.lastSaved),
			state: {
				...data.state,
				startTime: data.state.startTime ? new Date(data.state.startTime) : null,
				endTime: data.state.endTime ? new Date(data.state.endTime) : null,
				pausedTime: data.state.pausedTime ? new Date(data.state.pausedTime) : null
			},
			recovery: {
				...data.recovery,
				lastAccurateTime: new Date(data.recovery.lastAccurateTime)
			}
		};
	}

	private startAutoSave(): void {
		// Auto-save will be triggered by the timer store
		// This method sets up the interval for periodic saves
		this.autoSaveInterval = setInterval(() => {
			eventBus.emit('timer:auto-save-requested', { timestamp: new Date() });
		}, AUTO_SAVE_INTERVAL);
	}

	private startAccuracyMonitoring(): void {
		this.accuracyCheckInterval = setInterval(() => {
			eventBus.emit('timer:accuracy-check-requested', { timestamp: new Date() });
		}, ACCURACY_CHECK_INTERVAL);
	}
}

// Export singleton instance
export const timerService = new TimerService();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', () => {
		timerService.cleanup();
	});
}

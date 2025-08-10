/**
 * TimeFlow Pro Timer Store
 * 
 * Reactive Svelte store for managing timer state, including start/stop/pause functionality,
 * time tracking, and integration with projects and tasks.
 * 
 * @example
 * ```typescript
 * import { timerStore } from '$lib/stores/timerStore';
 * 
 * // Subscribe to timer state
 * timerStore.subscribe(state => {
 *   console.log('Timer state:', state);
 * });
 * 
 * // Start timer
 * timerStore.start({ projectId: '123', taskId: '456' });
 * 
 * // Stop timer
 * timerStore.stop();
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { TimerState, TimerStatus } from '$lib/types/index.js';
import { eventBus } from '$lib/utils/eventBus.js';
import { getCurrentTimestamp } from '$lib/utils/dateUtils.js';

// Timer state interface
interface TimerStoreState extends TimerState {
	// Additional store-specific properties
	intervalId?: number;
	lastTick?: Date;
	totalElapsed: number; // Total elapsed time including previous sessions
}

// Initial timer state
const initialState: TimerStoreState = {
	status: 'stopped',
	startTime: null,
	endTime: null,
	pausedTime: null,
	elapsedTime: 0,
	totalElapsed: 0,
	projectId: null,
	taskId: null,
	description: '',
	lastTick: undefined,
	intervalId: undefined
};

// Create the writable store
const { subscribe, set, update } = writable<TimerStoreState>(initialState);

// Timer interval duration (1 second)
const TIMER_INTERVAL = 1000;

/**
 * Start the timer with optional project and task
 */
function start(options: {
	projectId?: string;
	taskId?: string;
	description?: string;
} = {}): void {
	update(state => {
		// If timer is already running, stop it first
		if (state.status === 'running' && state.intervalId) {
			clearInterval(state.intervalId);
		}

		const now = new Date();
		const newState: TimerStoreState = {
			...state,
			status: 'running',
			startTime: now,
			endTime: null,
			pausedTime: null,
			elapsedTime: 0,
			projectId: options.projectId || state.projectId,
			taskId: options.taskId || state.taskId,
			description: options.description || state.description,
			lastTick: now
		};

		// Start the interval
		newState.intervalId = setInterval(() => {
			update(currentState => {
				if (currentState.status === 'running' && currentState.startTime) {
					const now = new Date();
					const elapsed = Math.floor((now.getTime() - currentState.startTime.getTime()) / 1000);
					return {
						...currentState,
						elapsedTime: elapsed,
						lastTick: now
					};
				}
				return currentState;
			});
		}, TIMER_INTERVAL);

		// Emit event
		eventBus.emit('timer:start', {
			projectId: newState.projectId,
			taskId: newState.taskId,
			timestamp: now
		});

		return newState;
	});
}

/**
 * Stop the timer and calculate final duration
 */
function stop(): void {
	update(state => {
		if (state.intervalId) {
			clearInterval(state.intervalId);
		}

		const now = new Date();
		const finalElapsed = state.startTime 
			? Math.floor((now.getTime() - state.startTime.getTime()) / 1000)
			: state.elapsedTime;

		const newState: TimerStoreState = {
			...state,
			status: 'stopped',
			endTime: now,
			elapsedTime: finalElapsed,
			totalElapsed: state.totalElapsed + finalElapsed,
			intervalId: undefined,
			lastTick: now
		};

		// Emit event
		eventBus.emit('timer:stop', {
			duration: finalElapsed,
			timestamp: now
		});

		return newState;
	});
}

/**
 * Pause the timer
 */
function pause(): void {
	update(state => {
		if (state.status !== 'running') return state;

		if (state.intervalId) {
			clearInterval(state.intervalId);
		}

		const now = new Date();
		const elapsed = state.startTime 
			? Math.floor((now.getTime() - state.startTime.getTime()) / 1000)
			: state.elapsedTime;

		const newState: TimerStoreState = {
			...state,
			status: 'paused',
			pausedTime: now,
			elapsedTime: elapsed,
			intervalId: undefined,
			lastTick: now
		};

		// Emit event
		eventBus.emit('timer:pause', {
			timestamp: now
		});

		return newState;
	});
}

/**
 * Resume the timer from paused state
 */
function resume(): void {
	update(state => {
		if (state.status !== 'paused') return state;

		const now = new Date();
		// Adjust start time to account for paused duration
		const pausedDuration = state.pausedTime 
			? now.getTime() - state.pausedTime.getTime()
			: 0;
		
		const adjustedStartTime = state.startTime 
			? new Date(state.startTime.getTime() + pausedDuration)
			: now;

		const newState: TimerStoreState = {
			...state,
			status: 'running',
			startTime: adjustedStartTime,
			pausedTime: null,
			lastTick: now
		};

		// Start the interval again
		newState.intervalId = setInterval(() => {
			update(currentState => {
				if (currentState.status === 'running' && currentState.startTime) {
					const now = new Date();
					const elapsed = Math.floor((now.getTime() - currentState.startTime.getTime()) / 1000);
					return {
						...currentState,
						elapsedTime: elapsed,
						lastTick: now
					};
				}
				return currentState;
			});
		}, TIMER_INTERVAL);

		// Emit event
		eventBus.emit('timer:resume', {
			timestamp: now
		});

		return newState;
	});
}

/**
 * Reset the timer to initial state
 */
function reset(): void {
	update(state => {
		if (state.intervalId) {
			clearInterval(state.intervalId);
		}

		const now = new Date();
		const newState: TimerStoreState = {
			...initialState,
			lastTick: now
		};

		// Emit event
		eventBus.emit('timer:reset', {
			timestamp: now
		});

		return newState;
	});
}

/**
 * Update timer project and task
 */
function updateContext(projectId?: string, taskId?: string, description?: string): void {
	update(state => ({
		...state,
		projectId: projectId ?? state.projectId,
		taskId: taskId ?? state.taskId,
		description: description ?? state.description
	}));
}

/**
 * Get current timer state (non-reactive)
 */
function getCurrentState(): TimerStoreState {
	return get({ subscribe });
}

// Derived stores for computed values
export const isRunning = derived(
	{ subscribe },
	state => state.status === 'running'
);

export const isPaused = derived(
	{ subscribe },
	state => state.status === 'paused'
);

export const isStopped = derived(
	{ subscribe },
	state => state.status === 'stopped'
);

export const currentElapsed = derived(
	{ subscribe },
	state => state.elapsedTime
);

export const hasActiveTimer = derived(
	{ subscribe },
	state => state.status === 'running' || state.status === 'paused'
);

export const timerContext = derived(
	{ subscribe },
	state => ({
		projectId: state.projectId,
		taskId: state.taskId,
		description: state.description
	})
);

// Cleanup function for when the store is no longer needed
function cleanup(): void {
	const state = getCurrentState();
	if (state.intervalId) {
		clearInterval(state.intervalId);
	}
}

// Export the store with methods
export const timerStore = {
	subscribe,
	start,
	stop,
	pause,
	resume,
	reset,
	updateContext,
	getCurrentState,
	cleanup
};

// Auto-cleanup on page unload (browser only)
if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', cleanup);
}

// Note: Derived stores are already exported above individually

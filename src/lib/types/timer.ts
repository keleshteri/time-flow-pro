/**
 * Timer-related TypeScript interfaces for TimeFlow Pro
 *
 * These interfaces define the structure for:
 * - Timer state management
 * - Timer sessions
 * - Timer configuration
 * - Timer display options
 * - Timer persistence
 */

export type TimerStatus = 'stopped' | 'running' | 'paused';

export interface TimerState {
	/** Current timer status */
	status: TimerStatus;

	/** When the timer was started (null if not running) */
	startTime: Date | null;

	/** When the timer was stopped (null if not stopped) */
	endTime: Date | null;

	/** When the timer was paused (null if not paused) */
	pausedTime: Date | null;

	/** Elapsed time in seconds */
	elapsedTime: number;

	/** Currently selected project ID */
	projectId: string | null;

	/** Currently selected task ID */
	taskId: string | null;

	/** Timer session description */
	description: string;
}

export interface TimerSession {
	/** Unique session identifier */
	id: string;

	/** Project associated with this session */
	projectId: string;

	/** Task associated with this session (optional) */
	taskId?: string;

	/** When the session started */
	startTime: Date;

	/** When the session ended (null if still active) */
	endTime: Date | null;

	/** Total duration in seconds */
	duration: number;

	/** Session description */
	description: string;

	/** Whether this session is active */
	isActive: boolean;

	/** When this session was created */
	createdAt: Date;

	/** When this session was last updated */
	updatedAt: Date;
}

export interface TimerConfig {
	/** Auto-save interval in seconds */
	autoSaveInterval: number;

	/** Whether to show notifications */
	showNotifications: boolean;

	/** Notification interval in minutes */
	notificationInterval: number;

	/** Whether to track idle time */
	trackIdleTime: boolean;

	/** Idle timeout in minutes */
	idleTimeout: number;

	/** Default project for new sessions */
	defaultProject?: string;

	/** Whether to auto-start timer on page load */
	autoStart: boolean;
}

export interface TimerDisplayOptions {
	/** Format for time display (HH:MM:SS, HH:MM, etc.) */
	format: 'HH:MM:SS' | 'HH:MM' | 'decimal';

	/** Whether to show seconds */
	showSeconds: boolean;

	/** Whether to show milliseconds */
	showMilliseconds: boolean;

	/** Color scheme for timer display */
	colorScheme: 'default' | 'minimal' | 'colorful';
}

export interface TimerPersistenceState {
	/** Timer state data */
	state: TimerState;

	/** When the state was last saved */
	lastSaved: Date;

	/** Session recovery data */
	recovery: {
		/** Browser session ID */
		sessionId: string;

		/** Last known accurate time */
		lastAccurateTime: Date;

		/** Performance timestamp for accuracy validation */
		performanceTimestamp: number;
	};
}

export interface TimerAccuracyMetrics {
	/** Expected elapsed time based on start time */
	expectedElapsed: number;

	/** Actual elapsed time from timer */
	actualElapsed: number;

	/** Drift in seconds (positive = timer is ahead) */
	drift: number;

	/** Whether drift is within acceptable range */
	isAccurate: boolean;

	/** Last accuracy check timestamp */
	lastCheck: Date;
}

export interface TimerEvents {
	'timer:start': { projectId?: string; taskId?: string; timestamp: Date };
	'timer:stop': { duration: number; timestamp: Date };
	'timer:pause': { timestamp: Date };
	'timer:resume': { timestamp: Date };
	'timer:reset': { timestamp: Date };
	'timer:accuracy-warning': { drift: number; timestamp: Date };
}

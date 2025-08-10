/**
 * Timer-related TypeScript interfaces for TimeFlow Pro
 *
 * These interfaces define the structure for:
 * - Timer state management
 * - Timer sessions
 * - Timer configuration
 */

export interface TimerState {
	/** Whether the timer is currently running */
	isRunning: boolean;

	/** When the timer was started (null if not running) */
	startTime: Date | null;

	/** Elapsed time in seconds */
	elapsed: number;

	/** Currently selected project ID */
	currentProject: string | null;

	/** Currently selected task ID */
	currentTask: string | null;

	/** Timer session description */
	description?: string;
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

export type TimerStatus = 'stopped' | 'running' | 'paused';

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

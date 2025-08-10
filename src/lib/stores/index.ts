/**
 * TimeFlow Pro Stores
 * 
 * Central export point for all Svelte stores providing reactive state management
 * for the entire application.
 */

// Timer Store - Real-time timer functionality
export {
	timerStore,
	isRunning,
	isPaused,
	isStopped,
	currentElapsed,
	hasActiveTimer,
	timerContext
} from './timerStore.js';

// Project Store - Project, task, and time entry management
export {
	projectStore,
	selectedProject,
	selectedTask,
	projectsWithTasks,
	selectedProjectTasks
} from './projectStore.js';

// Settings Store - Application settings and preferences
export {
	settingsStore,
	appearanceSettings,
	timerSettings,
	trackingSettings,
	notificationSettings
} from './settingsStore.js';

// Re-export types for convenience
export type { AppSettings } from './settingsStore.js';

/**
 * TimeFlow Pro Settings Store
 * 
 * Reactive Svelte store for managing application settings and user preferences.
 * Provides persistent storage and reactive updates for all app configuration.
 * 
 * @example
 * ```typescript
 * import { settingsStore } from '$lib/stores/settingsStore';
 * 
 * // Subscribe to settings
 * settingsStore.subscribe(settings => {
 *   console.log('Theme:', settings.theme);
 * });
 * 
 * // Update setting
 * settingsStore.updateSetting('theme', 'dark');
 * 
 * // Reset to defaults
 * settingsStore.reset();
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { eventBus } from '$lib/utils/eventBus.js';

// Settings interface
export interface AppSettings {
	// Appearance
	theme: 'light' | 'dark' | 'system';
	language: string;
	fontSize: 'small' | 'medium' | 'large';
	
	// Timer settings
	autoStartTimer: boolean;
	showTimerInTitle: boolean;
	timerSoundEnabled: boolean;
	timerSoundVolume: number; // 0-100
	reminderInterval: number; // minutes, 0 = disabled
	
	// Time tracking
	defaultProjectId: string | null;
	roundTimeEntries: boolean;
	roundingInterval: number; // minutes (1, 5, 15, 30)
	trackIdleTime: boolean;
	idleTimeThreshold: number; // minutes
	
	// Notifications
	notificationsEnabled: boolean;
	desktopNotifications: boolean;
	emailNotifications: boolean;
	weeklyReports: boolean;
	
	// Data and privacy
	autoSave: boolean;
	autoSaveInterval: number; // minutes
	dataRetentionDays: number; // 0 = forever
	analyticsEnabled: boolean;
	
	// Export settings
	defaultExportFormat: 'csv' | 'pdf' | 'json';
	includeTaskDetails: boolean;
	includeProjectSummary: boolean;
	
	// Advanced
	developerMode: boolean;
	debugLogging: boolean;
	experimentalFeatures: boolean;
}

// Default settings
const defaultSettings: AppSettings = {
	// Appearance
	theme: 'system',
	language: 'en',
	fontSize: 'medium',
	
	// Timer settings
	autoStartTimer: false,
	showTimerInTitle: true,
	timerSoundEnabled: true,
	timerSoundVolume: 50,
	reminderInterval: 0,
	
	// Time tracking
	defaultProjectId: null,
	roundTimeEntries: false,
	roundingInterval: 15,
	trackIdleTime: true,
	idleTimeThreshold: 5,
	
	// Notifications
	notificationsEnabled: true,
	desktopNotifications: false,
	emailNotifications: false,
	weeklyReports: false,
	
	// Data and privacy
	autoSave: true,
	autoSaveInterval: 5,
	dataRetentionDays: 0,
	analyticsEnabled: false,
	
	// Export settings
	defaultExportFormat: 'csv',
	includeTaskDetails: true,
	includeProjectSummary: true,
	
	// Advanced
	developerMode: false,
	debugLogging: false,
	experimentalFeatures: false
};

// Storage key for localStorage
const STORAGE_KEY = 'timeflow-settings';

/**
 * Load settings from localStorage
 */
function loadSettings(): AppSettings {
	if (!browser) return defaultSettings;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Merge with defaults to handle new settings
			return { ...defaultSettings, ...parsed };
		}
	} catch (error) {
		console.warn('Failed to load settings from localStorage:', error);
	}
	
	return defaultSettings;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AppSettings): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (error) {
		console.warn('Failed to save settings to localStorage:', error);
	}
}

// Create the writable store with loaded settings
const { subscribe, set, update } = writable<AppSettings>(loadSettings());

/**
 * Update a single setting
 */
function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
	update(settings => {
		const newSettings = { ...settings, [key]: value };
		saveSettings(newSettings);
		
		// Emit event for setting change
		eventBus.emit('settings:updated', { key, value });
		
		// Special handling for theme changes
		if (key === 'theme') {
			eventBus.emit('ui:theme:changed', { theme: value as AppSettings['theme'] });
			applyTheme(value as AppSettings['theme']);
		}
		
		return newSettings;
	});
}

/**
 * Update multiple settings at once
 */
function updateSettings(updates: Partial<AppSettings>): void {
	update(settings => {
		const newSettings = { ...settings, ...updates };
		saveSettings(newSettings);
		
		// Emit events for each changed setting
		Object.entries(updates).forEach(([key, value]) => {
			eventBus.emit('settings:updated', { key, value });
		});
		
		// Handle theme change if included
		if (updates.theme) {
			eventBus.emit('ui:theme:changed', { theme: updates.theme });
			applyTheme(updates.theme);
		}
		
		return newSettings;
	});
}

/**
 * Reset settings to defaults
 */
function reset(): void {
	set(defaultSettings);
	saveSettings(defaultSettings);
	
	eventBus.emit('settings:reset', { timestamp: new Date() });
	applyTheme(defaultSettings.theme);
}

/**
 * Reset a specific category of settings
 */
function resetCategory(category: 'appearance' | 'timer' | 'tracking' | 'notifications' | 'data' | 'export' | 'advanced'): void {
	const categoryDefaults: Partial<AppSettings> = {};
	
	switch (category) {
		case 'appearance':
			categoryDefaults.theme = defaultSettings.theme;
			categoryDefaults.language = defaultSettings.language;
			categoryDefaults.fontSize = defaultSettings.fontSize;
			break;
		case 'timer':
			categoryDefaults.autoStartTimer = defaultSettings.autoStartTimer;
			categoryDefaults.showTimerInTitle = defaultSettings.showTimerInTitle;
			categoryDefaults.timerSoundEnabled = defaultSettings.timerSoundEnabled;
			categoryDefaults.timerSoundVolume = defaultSettings.timerSoundVolume;
			categoryDefaults.reminderInterval = defaultSettings.reminderInterval;
			break;
		case 'tracking':
			categoryDefaults.defaultProjectId = defaultSettings.defaultProjectId;
			categoryDefaults.roundTimeEntries = defaultSettings.roundTimeEntries;
			categoryDefaults.roundingInterval = defaultSettings.roundingInterval;
			categoryDefaults.trackIdleTime = defaultSettings.trackIdleTime;
			categoryDefaults.idleTimeThreshold = defaultSettings.idleTimeThreshold;
			break;
		case 'notifications':
			categoryDefaults.notificationsEnabled = defaultSettings.notificationsEnabled;
			categoryDefaults.desktopNotifications = defaultSettings.desktopNotifications;
			categoryDefaults.emailNotifications = defaultSettings.emailNotifications;
			categoryDefaults.weeklyReports = defaultSettings.weeklyReports;
			break;
		case 'data':
			categoryDefaults.autoSave = defaultSettings.autoSave;
			categoryDefaults.autoSaveInterval = defaultSettings.autoSaveInterval;
			categoryDefaults.dataRetentionDays = defaultSettings.dataRetentionDays;
			categoryDefaults.analyticsEnabled = defaultSettings.analyticsEnabled;
			break;
		case 'export':
			categoryDefaults.defaultExportFormat = defaultSettings.defaultExportFormat;
			categoryDefaults.includeTaskDetails = defaultSettings.includeTaskDetails;
			categoryDefaults.includeProjectSummary = defaultSettings.includeProjectSummary;
			break;
		case 'advanced':
			categoryDefaults.developerMode = defaultSettings.developerMode;
			categoryDefaults.debugLogging = defaultSettings.debugLogging;
			categoryDefaults.experimentalFeatures = defaultSettings.experimentalFeatures;
			break;
	}
	
	updateSettings(categoryDefaults);
}

/**
 * Get current settings (non-reactive)
 */
function getCurrentSettings(): AppSettings {
	return get({ subscribe });
}

/**
 * Apply theme to document
 */
function applyTheme(theme: AppSettings['theme']): void {
	if (!browser) return;
	
	const root = document.documentElement;
	
	// Remove existing theme classes
	root.classList.remove('light', 'dark');
	
	if (theme === 'system') {
		// Use system preference
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		root.classList.add(prefersDark ? 'dark' : 'light');
	} else {
		root.classList.add(theme);
	}
}

/**
 * Export settings as JSON
 */
function exportSettings(): string {
	const settings = getCurrentSettings();
	return JSON.stringify(settings, null, 2);
}

/**
 * Import settings from JSON
 */
function importSettings(jsonString: string): boolean {
	try {
		const imported = JSON.parse(jsonString);
		
		// Validate that imported data has valid structure
		const validKeys = Object.keys(defaultSettings);
		const importedKeys = Object.keys(imported);
		
		// Filter out invalid keys
		const validImported: Partial<AppSettings> = {};
		importedKeys.forEach(key => {
			if (validKeys.includes(key)) {
				validImported[key as keyof AppSettings] = imported[key];
			}
		});
		
		updateSettings(validImported);
		return true;
	} catch (error) {
		console.error('Failed to import settings:', error);
		return false;
	}
}

// Derived stores for specific setting categories
export const appearanceSettings = derived(
	{ subscribe },
	settings => ({
		theme: settings.theme,
		language: settings.language,
		fontSize: settings.fontSize
	})
);

export const timerSettings = derived(
	{ subscribe },
	settings => ({
		autoStartTimer: settings.autoStartTimer,
		showTimerInTitle: settings.showTimerInTitle,
		timerSoundEnabled: settings.timerSoundEnabled,
		timerSoundVolume: settings.timerSoundVolume,
		reminderInterval: settings.reminderInterval
	})
);

export const trackingSettings = derived(
	{ subscribe },
	settings => ({
		defaultProjectId: settings.defaultProjectId,
		roundTimeEntries: settings.roundTimeEntries,
		roundingInterval: settings.roundingInterval,
		trackIdleTime: settings.trackIdleTime,
		idleTimeThreshold: settings.idleTimeThreshold
	})
);

export const notificationSettings = derived(
	{ subscribe },
	settings => ({
		notificationsEnabled: settings.notificationsEnabled,
		desktopNotifications: settings.desktopNotifications,
		emailNotifications: settings.emailNotifications,
		weeklyReports: settings.weeklyReports
	})
);

// Initialize theme on store creation
if (browser) {
	const settings = getCurrentSettings();
	applyTheme(settings.theme);
	
	// Listen for system theme changes
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	mediaQuery.addEventListener('change', () => {
		const currentSettings = getCurrentSettings();
		if (currentSettings.theme === 'system') {
			applyTheme('system');
		}
	});
}

// Export the store with methods
export const settingsStore = {
	subscribe,
	updateSetting,
	updateSettings,
	reset,
	resetCategory,
	getCurrentSettings,
	exportSettings,
	importSettings
};

// Export derived stores
export {
	appearanceSettings,
	timerSettings,
	trackingSettings,
	notificationSettings
};

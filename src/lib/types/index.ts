/**
 * TimeFlow Pro Type Definitions
 *
 * Central export point for all TypeScript interfaces and types
 * used throughout the TimeFlow Pro application.
 */

// Timer types
export type {
	TimerState,
	TimerSession,
	TimerConfig,
	TimerStatus,
	TimerDisplayOptions
} from './timer.js';

// Project types
export type { Project, ProjectStatus, ProjectSummary, Client, ProjectFilter } from './project.js';

// Task types
export type {
	Task,
	TaskPriority,
	TaskStatus,
	TaskSummary,
	TaskFilter,
	TaskProgress
} from './task.js';

// Time entry types
export type {
	TimeEntry,
	TimeEntryCategory,
	BillingStatus,
	TimeEntryFilter,
	TimeEntrySummary,
	DailyTimeEntry,
	TimeEntryValidation,
	BulkTimeEntryOperation
} from './time-entry.js';

// Component types
export type {
	BaseComponentProps,
	ButtonProps,
	ButtonVariant,
	ButtonSize,
	ButtonType,
	InputProps,
	InputType,
	InputSize,
	InputVariant,
	ModalProps,
	ModalSize,
	CardProps,
	CardVariant,
	CardPadding,
	ValidationRule,
	FormFieldState,
	ThemeColors,
	ComponentTheme,
	AccessibilityProps,
	AnimationProps,
	ResponsiveProps,
	ComponentEventHandlers,
	LoadingProps,
	IconProps
} from './components.js';

// Common utility types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T = unknown> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface SortOptions {
	field: string;
	direction: 'asc' | 'desc';
}

export interface DateRange {
	start: string; // ISO date string
	end: string; // ISO date string
}

export interface AppError {
	id: string;
	type: 'network' | 'storage' | 'sync' | 'validation' | 'general';
	message: string;
	details?: Record<string, unknown>;
	timestamp: Date;
	resolved: boolean;
}

export interface AppSettings {
	theme: 'light' | 'dark' | 'system';
	language: string;
	timezone: string;
	dateFormat: string;
	timeFormat: '12h' | '24h';
	currency: string;
	notifications: {
		enabled: boolean;
		timerReminders: boolean;
		breakReminders: boolean;
		dailySummary: boolean;
	};
	privacy: {
		analytics: boolean;
		crashReporting: boolean;
	};
}

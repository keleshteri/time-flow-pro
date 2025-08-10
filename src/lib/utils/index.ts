/**
 * TimeFlow Pro Utilities
 * 
 * Central export point for all utility functions providing common functionality
 * across the application.
 */

// Date and Time Utilities
export {
	formatDuration,
	formatDurationHuman,
	calculateDuration,
	calculateDurationSeconds,
	formatDate,
	formatDateLocalized,
	formatTime,
	formatDateTime,
	startOfDay,
	endOfDay,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	addDays,
	addHours,
	addMinutes,
	isSameDay,
	isToday,
	isYesterday,
	getRelativeTime,
	parseTimeToSeconds,
	getCurrentTimestamp,
	isWeekend,
	getBusinessDays
} from './dateUtils.js';

// Validation Utilities
export {
	isValidEmail,
	validateEmail,
	validatePassword,
	validateUrl,
	validatePhone,
	validateRequired,
	validateLength,
	validateNumber,
	validateDate,
	required,
	minLength,
	maxLength,
	email,
	pattern,
	createValidator,
	validateFields,
	allValid,
	getAllErrors
} from './validationUtils.js';

// Event Bus System
export {
	eventBus,
	EventBus
} from './eventBus.js';

// Re-export types for convenience
export type {
	ValidationResult,
	ValidationRule
} from './validationUtils.js';

export type {
	EventMap,
	EventListener
} from './eventBus.js';

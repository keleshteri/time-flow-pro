/**
 * TimeFlow Pro Date Utilities
 * 
 * Comprehensive date and time utility functions for time tracking,
 * formatting, calculations, and date manipulations.
 * 
 * @example
 * ```typescript
 * import { formatDuration, calculateDuration, formatDate } from '$lib/utils/dateUtils';
 * 
 * const duration = formatDuration(3665); // "01:01:05"
 * const hours = calculateDuration(startDate, endDate); // 2.5
 * const formatted = formatDate(new Date()); // "2024-01-15"
 * ```
 */

/**
 * Format duration in seconds to HH:MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format duration in seconds to human-readable format
 * @param seconds - Duration in seconds
 * @param short - Use short format (1h 30m vs 1 hour 30 minutes)
 * @returns Human-readable duration string
 */
export function formatDurationHuman(seconds: number, short = false): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(short ? `${hours}h` : `${hours} hour${hours !== 1 ? 's' : ''}`);
	}
	if (minutes > 0) {
		parts.push(short ? `${minutes}m` : `${minutes} minute${minutes !== 1 ? 's' : ''}`);
	}
	if (secs > 0 && hours === 0) {
		parts.push(short ? `${secs}s` : `${secs} second${secs !== 1 ? 's' : ''}`);
	}

	return parts.length > 0 ? parts.join(' ') : (short ? '0s' : '0 seconds');
}

/**
 * Calculate duration between two dates in hours
 * @param startTime - Start date
 * @param endTime - End date
 * @returns Duration in hours (decimal)
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
	return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

/**
 * Calculate duration between two dates in seconds
 * @param startTime - Start date
 * @param endTime - End date
 * @returns Duration in seconds
 */
export function calculateDurationSeconds(startTime: Date, endTime: Date): number {
	return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
}

/**
 * Format date to YYYY-MM-DD format
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0] ?? '';
}

/**
 * Format date to localized string
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Localized date string
 */
export function formatDateLocalized(
	date: Date,
	locale = 'en-US',
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}
): string {
	return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format time to HH:MM format
 * @param date - Date to format
 * @param use24Hour - Use 24-hour format (default: true)
 * @returns Formatted time string
 */
export function formatTime(date: Date, use24Hour = true): string {
	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: !use24Hour
	};
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Format datetime to localized string
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Localized datetime string
 */
export function formatDateTime(date: Date, locale = 'en-US'): string {
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

/**
 * Get start of day for a given date
 * @param date - Input date
 * @returns Date at start of day (00:00:00)
 */
export function startOfDay(date: Date): Date {
	const result = new Date(date);
	result.setHours(0, 0, 0, 0);
	return result;
}

/**
 * Get end of day for a given date
 * @param date - Input date
 * @returns Date at end of day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
	const result = new Date(date);
	result.setHours(23, 59, 59, 999);
	return result;
}

/**
 * Get start of week for a given date
 * @param date - Input date
 * @param startOfWeek - Day of week to start (0 = Sunday, 1 = Monday)
 * @returns Date at start of week
 */
export function startOfWeek(date: Date, startOfWeek = 1): Date {
	const result = new Date(date);
	const day = result.getDay();
	const diff = (day < startOfWeek ? 7 : 0) + day - startOfWeek;
	result.setDate(result.getDate() - diff);
	return startOfDay(result);
}

/**
 * Get end of week for a given date
 * @param date - Input date
 * @param startOfWeek - Day of week to start (0 = Sunday, 1 = Monday)
 * @returns Date at end of week
 */
export function endOfWeek(date: Date, startOfWeek = 1): Date {
	const result = startOfWeek(date, startOfWeek);
	result.setDate(result.getDate() + 6);
	return endOfDay(result);
}

/**
 * Get start of month for a given date
 * @param date - Input date
 * @returns Date at start of month
 */
export function startOfMonth(date: Date): Date {
	const result = new Date(date);
	result.setDate(1);
	return startOfDay(result);
}

/**
 * Get end of month for a given date
 * @param date - Input date
 * @returns Date at end of month
 */
export function endOfMonth(date: Date): Date {
	const result = new Date(date);
	result.setMonth(result.getMonth() + 1, 0);
	return endOfDay(result);
}

/**
 * Add days to a date
 * @param date - Input date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 * Add hours to a date
 * @param date - Input date
 * @param hours - Number of hours to add (can be negative)
 * @returns New date with hours added
 */
export function addHours(date: Date, hours: number): Date {
	const result = new Date(date);
	result.setTime(result.getTime() + hours * 60 * 60 * 1000);
	return result;
}

/**
 * Add minutes to a date
 * @param date - Input date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New date with minutes added
 */
export function addMinutes(date: Date, minutes: number): Date {
	const result = new Date(date);
	result.setTime(result.getTime() + minutes * 60 * 1000);
	return result;
}

/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
	return formatDate(date1) === formatDate(date2);
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
	return isSameDay(date, new Date());
}

/**
 * Check if a date is yesterday
 * @param date - Date to check
 * @returns True if date is yesterday
 */
export function isYesterday(date: Date): boolean {
	const yesterday = addDays(new Date(), -1);
	return isSameDay(date, yesterday);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to compare
 * @param baseDate - Base date to compare against (default: now)
 * @returns Relative time string
 */
export function getRelativeTime(date: Date, baseDate = new Date()): string {
	const diffMs = date.getTime() - baseDate.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	if (Math.abs(diffDays) >= 1) {
		return rtf.format(diffDays, 'day');
	} else if (Math.abs(diffHours) >= 1) {
		return rtf.format(diffHours, 'hour');
	} else if (Math.abs(diffMinutes) >= 1) {
		return rtf.format(diffMinutes, 'minute');
	} else {
		return rtf.format(diffSeconds, 'second');
	}
}

/**
 * Parse time string (HH:MM or HH:MM:SS) to seconds
 * @param timeString - Time string to parse
 * @returns Total seconds
 */
export function parseTimeToSeconds(timeString: string): number {
	const parts = timeString.split(':').map(Number);
	if (parts.length === 2) {
		return parts[0] * 3600 + parts[1] * 60;
	} else if (parts.length === 3) {
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	}
	throw new Error('Invalid time format. Expected HH:MM or HH:MM:SS');
}

/**
 * Get current timestamp in ISO format
 * @returns Current timestamp string
 */
export function getCurrentTimestamp(): string {
	return new Date().toISOString();
}

/**
 * Check if a date is a weekend
 * @param date - Date to check
 * @returns True if date is Saturday or Sunday
 */
export function isWeekend(date: Date): boolean {
	const day = date.getDay();
	return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Get business days between two dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of business days
 */
export function getBusinessDays(startDate: Date, endDate: Date): number {
	let count = 0;
	const current = new Date(startDate);
	
	while (current <= endDate) {
		if (!isWeekend(current)) {
			count++;
		}
		current.setDate(current.getDate() + 1);
	}
	
	return count;
}

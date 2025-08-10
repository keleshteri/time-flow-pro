/**
 * TimeFlow Pro Time Utilities
 * 
 * Specialized time utilities for timer functionality including:
 * - High-precision time formatting
 * - Accuracy validation helpers
 * - Duration calculations with drift compensation
 * - Performance-optimized time operations
 * 
 * @example
 * ```typescript
 * import { formatTimerDisplay, validateAccuracy, calculatePreciseDuration } from '$lib/utils/time-utils';
 * 
 * const display = formatTimerDisplay(3665, { showMilliseconds: true }); // "01:01:05.000"
 * const isAccurate = validateAccuracy(startTime, expectedElapsed, actualElapsed); // true/false
 * const duration = calculatePreciseDuration(startTime, endTime); // 3665.123
 * ```
 */

import type { TimerDisplayOptions, TimerAccuracyMetrics } from '$lib/types/timer.js';

/**
 * Format time for timer display with various options
 * @param seconds - Time in seconds
 * @param options - Display formatting options
 * @returns Formatted time string
 */
export function formatTimerDisplay(
	seconds: number,
	options: Partial<TimerDisplayOptions> = {}
): string {
	// Handle negative values by treating them as 0
	const safeSeconds = Math.max(0, seconds);

	const {
		format = 'HH:MM:SS',
		showSeconds = true,
		showMilliseconds = false
	} = options;

	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const secs = Math.floor(safeSeconds % 60);
	const milliseconds = Math.floor((safeSeconds % 1) * 1000);

	switch (format) {
		case 'HH:MM:SS':
			let result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
			if (showSeconds) {
				result += `:${secs.toString().padStart(2, '0')}`;
			}
			if (showMilliseconds && showSeconds) {
				result += `.${milliseconds.toString().padStart(3, '0')}`;
			}
			return result;

		case 'HH:MM':
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

		case 'decimal':
			return (seconds / 3600).toFixed(2);

		default:
			return formatTimerDisplay(seconds, { ...options, format: 'HH:MM:SS' });
	}
}

/**
 * Format time for compact display (removes leading zeros)
 * @param seconds - Time in seconds
 * @param showSeconds - Whether to show seconds
 * @returns Compact formatted time string
 */
export function formatTimerCompact(seconds: number, showSeconds = true): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return showSeconds 
			? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
			: `${hours}:${minutes.toString().padStart(2, '0')}`;
	}

	return showSeconds 
		? `${minutes}:${secs.toString().padStart(2, '0')}`
		: `${minutes}m`;
}

/**
 * Calculate precise duration between two dates using performance timing
 * @param startTime - Start date
 * @param endTime - End date (defaults to now)
 * @param usePerformanceNow - Use performance.now() for higher precision
 * @returns Duration in seconds with decimal precision
 */
export function calculatePreciseDuration(
	startTime: Date, 
	endTime: Date = new Date(),
	usePerformanceNow = false
): number {
	if (usePerformanceNow && typeof performance !== 'undefined') {
		// Use performance.now() for sub-millisecond precision
		const startPerf = performance.timeOrigin + performance.now();
		const endPerf = endTime.getTime();
		return (endPerf - startPerf) / 1000;
	}

	return (endTime.getTime() - startTime.getTime()) / 1000;
}

/**
 * Validate timer accuracy against expected duration
 * @param startTime - When timer started
 * @param actualElapsed - Elapsed time from timer
 * @param maxDriftSeconds - Maximum acceptable drift (default: 2 seconds)
 * @returns Accuracy validation result
 */
export function validateAccuracy(
	startTime: Date,
	actualElapsed: number,
	maxDriftSeconds = 2
): TimerAccuracyMetrics {
	const now = new Date();
	const expectedElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
	const drift = actualElapsed - expectedElapsed;

	return {
		expectedElapsed,
		actualElapsed,
		drift,
		isAccurate: Math.abs(drift) <= maxDriftSeconds,
		lastCheck: now
	};
}

/**
 * Compensate for timer drift by adjusting elapsed time
 * @param actualElapsed - Current elapsed time
 * @param drift - Detected drift in seconds
 * @param maxCompensation - Maximum compensation to apply (default: 5 seconds)
 * @returns Compensated elapsed time
 */
export function compensateDrift(
	actualElapsed: number, 
	drift: number, 
	maxCompensation = 5
): number {
	// Only compensate if drift is within reasonable bounds
	if (Math.abs(drift) > maxCompensation) {
		console.warn(`Timer drift too large to compensate: ${drift}s`);
		return actualElapsed;
	}

	return actualElapsed - drift;
}

/**
 * Parse time string back to seconds
 * @param timeString - Time string in HH:MM:SS format
 * @returns Time in seconds
 */
export function parseTimeString(timeString: string): number {
	const parts = timeString.split(':').map(part => parseInt(part, 10));
	
	if (parts.length === 3) {
		// HH:MM:SS
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	} else if (parts.length === 2) {
		// MM:SS or HH:MM
		return parts[0] * 60 + parts[1];
	} else {
		return 0;
	}
}

/**
 * Get time remaining until target duration
 * @param currentElapsed - Current elapsed time in seconds
 * @param targetDuration - Target duration in seconds
 * @returns Remaining time in seconds (0 if target reached)
 */
export function getTimeRemaining(currentElapsed: number, targetDuration: number): number {
	return Math.max(0, targetDuration - currentElapsed);
}

/**
 * Check if timer has reached a milestone (hour, half-hour, etc.)
 * @param seconds - Current elapsed seconds
 * @param intervalSeconds - Milestone interval (default: 1800 = 30 minutes)
 * @returns True if milestone reached
 */
export function isMilestoneReached(seconds: number, intervalSeconds = 1800): boolean {
	return seconds > 0 && seconds % intervalSeconds === 0;
}

/**
 * Format time for accessibility (screen readers)
 * @param seconds - Time in seconds
 * @returns Human-readable time description
 */
export function formatTimeForAccessibility(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
	}
	if (minutes > 0) {
		parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
	}
	if (secs > 0) {
		parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
	}

	if (parts.length === 0) {
		return '0 seconds';
	}

	return parts.join(', ');
}

/**
 * Get timer display color based on elapsed time and status
 * @param seconds - Elapsed seconds
 * @param status - Timer status
 * @param thresholds - Time thresholds for color changes
 * @returns CSS color class or hex color
 */
export function getTimerDisplayColor(
	seconds: number,
	status: 'running' | 'paused' | 'stopped',
	thresholds = { warning: 3600, danger: 7200 } // 1 hour, 2 hours
): string {
	if (status === 'stopped') return 'text-gray-500';
	if (status === 'paused') return 'text-yellow-600';

	if (seconds >= thresholds.danger) return 'text-red-600';
	if (seconds >= thresholds.warning) return 'text-orange-600';
	
	return 'text-green-600';
}

/**
 * Create a smooth animation value for timer updates
 * @param currentValue - Current timer value
 * @param targetValue - Target timer value
 * @param animationSpeed - Animation speed factor (0-1)
 * @returns Interpolated value for smooth animation
 */
export function interpolateTimerValue(
	currentValue: number,
	targetValue: number,
	animationSpeed = 0.1
): number {
	const difference = targetValue - currentValue;
	return currentValue + (difference * animationSpeed);
}

/**
 * Debounce timer updates to prevent excessive re-renders
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounceTimerUpdate<T extends (...args: any[]) => void>(
	callback: T,
	delay = 100
): T {
	let timeoutId: number | null = null;

	return ((...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			callback(...args);
			timeoutId = null;
		}, delay);
	}) as T;
}

/**
 * Throttle timer updates for performance
 * @param callback - Function to throttle
 * @param limit - Throttle limit in milliseconds
 * @returns Throttled function
 */
export function throttleTimerUpdate<T extends (...args: any[]) => void>(
	callback: T,
	limit = 1000
): T {
	let inThrottle = false;

	return ((...args: Parameters<T>) => {
		if (!inThrottle) {
			callback(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	}) as T;
}

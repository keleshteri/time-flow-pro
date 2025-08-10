/**
 * Time Utilities Test Suite
 * 
 * Comprehensive tests for time formatting, accuracy validation,
 * and timer utility functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	formatTimerDisplay,
	formatTimerCompact,
	calculatePreciseDuration,
	validateAccuracy,
	compensateDrift,
	parseTimeString,
	getTimeRemaining,
	isMilestoneReached,
	formatTimeForAccessibility,
	getTimerDisplayColor,
	interpolateTimerValue,
	debounceTimerUpdate,
	throttleTimerUpdate
} from './time-utils.js';

describe('Time Utilities', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('formatTimerDisplay', () => {
		it('should format time in HH:MM:SS format', () => {
			expect(formatTimerDisplay(3665)).toBe('01:01:05');
			expect(formatTimerDisplay(0)).toBe('00:00:00');
			expect(formatTimerDisplay(7200)).toBe('02:00:00');
		});

		it('should format time in HH:MM format when seconds disabled', () => {
			expect(formatTimerDisplay(3665, { showSeconds: false })).toBe('01:01');
			expect(formatTimerDisplay(7200, { showSeconds: false })).toBe('02:00');
		});

		it('should show milliseconds when enabled', () => {
			expect(formatTimerDisplay(3665.123, { showMilliseconds: true })).toBe('01:01:05.123');
			expect(formatTimerDisplay(0.5, { showMilliseconds: true })).toBe('00:00:00.500');
		});

		it('should format in decimal format', () => {
			expect(formatTimerDisplay(3600, { format: 'decimal' })).toBe('1.00');
			expect(formatTimerDisplay(1800, { format: 'decimal' })).toBe('0.50');
		});
	});

	describe('formatTimerCompact', () => {
		it('should format time compactly without leading zeros', () => {
			expect(formatTimerCompact(3665)).toBe('1:01:05');
			expect(formatTimerCompact(65)).toBe('1:05');
			expect(formatTimerCompact(5)).toBe('0:05');
		});

		it('should format without seconds when disabled', () => {
			expect(formatTimerCompact(3665, false)).toBe('1:01');
			expect(formatTimerCompact(65, false)).toBe('1m');
		});
	});

	describe('calculatePreciseDuration', () => {
		it('should calculate duration between dates', () => {
			const start = new Date('2024-01-01T10:00:00Z');
			const end = new Date('2024-01-01T11:00:00Z');
			
			expect(calculatePreciseDuration(start, end)).toBe(3600);
		});

		it('should use current time when end not provided', () => {
			const start = new Date(Date.now() - 5000);
			const duration = calculatePreciseDuration(start);
			
			expect(duration).toBeCloseTo(5, 0);
		});
	});

	describe('validateAccuracy', () => {
		it('should validate timer accuracy', () => {
			const startTime = new Date(Date.now() - 10000); // 10 seconds ago
			const result = validateAccuracy(startTime, 10);
			
			expect(result.expectedElapsed).toBeCloseTo(10, 0);
			expect(result.actualElapsed).toBe(10);
			expect(result.drift).toBeCloseTo(0, 0);
			expect(result.isAccurate).toBe(true);
		});

		it('should detect drift when timer is inaccurate', () => {
			const startTime = new Date(Date.now() - 10000); // 10 seconds ago
			const result = validateAccuracy(startTime, 15, 2); // 5 second drift, 2 second tolerance
			
			expect(result.drift).toBeCloseTo(5, 0);
			expect(result.isAccurate).toBe(false);
		});
	});

	describe('compensateDrift', () => {
		it('should compensate for small drift', () => {
			expect(compensateDrift(105, 5)).toBe(100);
			expect(compensateDrift(95, -5)).toBe(100);
		});

		it('should not compensate for large drift', () => {
			expect(compensateDrift(120, 20)).toBe(120); // Drift too large
		});
	});

	describe('parseTimeString', () => {
		it('should parse HH:MM:SS format', () => {
			expect(parseTimeString('01:30:45')).toBe(5445);
			expect(parseTimeString('00:05:30')).toBe(330);
		});

		it('should parse MM:SS format', () => {
			expect(parseTimeString('30:45')).toBe(1845);
			expect(parseTimeString('05:30')).toBe(330);
		});

		it('should return 0 for invalid format', () => {
			expect(parseTimeString('invalid')).toBe(0);
			expect(parseTimeString('')).toBe(0);
		});
	});

	describe('getTimeRemaining', () => {
		it('should calculate remaining time', () => {
			expect(getTimeRemaining(30, 60)).toBe(30);
			expect(getTimeRemaining(45, 60)).toBe(15);
		});

		it('should return 0 when target reached', () => {
			expect(getTimeRemaining(60, 60)).toBe(0);
			expect(getTimeRemaining(70, 60)).toBe(0);
		});
	});

	describe('isMilestoneReached', () => {
		it('should detect milestone intervals', () => {
			expect(isMilestoneReached(1800)).toBe(true); // 30 minutes
			expect(isMilestoneReached(3600)).toBe(true); // 1 hour
			expect(isMilestoneReached(1799)).toBe(false);
		});

		it('should work with custom intervals', () => {
			expect(isMilestoneReached(600, 600)).toBe(true); // 10 minutes
			expect(isMilestoneReached(1200, 600)).toBe(true); // 20 minutes
			expect(isMilestoneReached(500, 600)).toBe(false);
		});
	});

	describe('formatTimeForAccessibility', () => {
		it('should format time for screen readers', () => {
			expect(formatTimeForAccessibility(3665)).toBe('1 hour, 1 minute, 5 seconds');
			expect(formatTimeForAccessibility(60)).toBe('1 minute');
			expect(formatTimeForAccessibility(1)).toBe('1 second');
			expect(formatTimeForAccessibility(0)).toBe('0 seconds');
		});

		it('should handle plurals correctly', () => {
			expect(formatTimeForAccessibility(7200)).toBe('2 hours');
			expect(formatTimeForAccessibility(120)).toBe('2 minutes');
			expect(formatTimeForAccessibility(2)).toBe('2 seconds');
		});

		it('should handle hours with minutes and seconds', () => {
			expect(formatTimeForAccessibility(3661)).toBe('1 hour, 1 minute, 1 second');
			expect(formatTimeForAccessibility(7322)).toBe('2 hours, 2 minutes, 2 seconds');
		});
	});

	describe('getTimerDisplayColor', () => {
		it('should return appropriate colors for different statuses', () => {
			expect(getTimerDisplayColor(100, 'stopped')).toBe('text-gray-500');
			expect(getTimerDisplayColor(100, 'paused')).toBe('text-yellow-600');
			expect(getTimerDisplayColor(100, 'running')).toBe('text-green-600');
		});

		it('should change color based on time thresholds', () => {
			expect(getTimerDisplayColor(1800, 'running')).toBe('text-green-600'); // Under warning
			expect(getTimerDisplayColor(3600, 'running')).toBe('text-orange-600'); // Warning threshold
			expect(getTimerDisplayColor(7200, 'running')).toBe('text-red-600'); // Danger threshold
		});
	});

	describe('interpolateTimerValue', () => {
		it('should interpolate between values', () => {
			const result = interpolateTimerValue(0, 10, 0.5);
			expect(result).toBe(5);
		});

		it('should handle small animation steps', () => {
			const result = interpolateTimerValue(0, 10, 0.1);
			expect(result).toBe(1);
		});
	});

	describe('debounceTimerUpdate', () => {
		it('should debounce function calls', async () => {
			const mockFn = vi.fn();
			const debouncedFn = debounceTimerUpdate(mockFn, 100);

			debouncedFn('test1');
			debouncedFn('test2');
			debouncedFn('test3');

			expect(mockFn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);

			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith('test3');
		});
	});

	describe('throttleTimerUpdate', () => {
		it('should throttle function calls', () => {
			const mockFn = vi.fn();
			const throttledFn = throttleTimerUpdate(mockFn, 100);

			throttledFn('test1');
			throttledFn('test2');
			throttledFn('test3');

			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith('test1');

			vi.advanceTimersByTime(100);

			throttledFn('test4');
			expect(mockFn).toHaveBeenCalledTimes(2);
			expect(mockFn).toHaveBeenCalledWith('test4');
		});
	});
});

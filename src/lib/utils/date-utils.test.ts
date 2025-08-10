/**
 * Date Utilities Tests
 *
 * Tests for date and time utility functions
 */

import { describe, it, expect } from 'vitest';
import { formatDuration, calculateDuration, formatDate, formatTime, addDays, isToday } from './dateUtils';
import { isValidEmail } from './validationUtils';

describe('Date Utilities', () => {
	describe('formatDuration', () => {
		it('should format seconds correctly', () => {
			expect(formatDuration(0)).toBe('00:00:00');
			expect(formatDuration(30)).toBe('00:00:30');
			expect(formatDuration(60)).toBe('00:01:00');
			expect(formatDuration(3661)).toBe('01:01:01');
		});

		it('should handle large durations', () => {
			expect(formatDuration(36000)).toBe('10:00:00');
			expect(formatDuration(90061)).toBe('25:01:01');
		});
	});

	describe('calculateDuration', () => {
		it('should calculate duration between dates correctly', () => {
			const start = new Date('2024-01-01T10:00:00Z');
			const end = new Date('2024-01-01T12:30:00Z');

			expect(calculateDuration(start, end)).toBe(2.5);
		});

		it('should handle same start and end time', () => {
			const date = new Date('2024-01-01T10:00:00Z');

			expect(calculateDuration(date, date)).toBe(0);
		});

		it('should handle negative duration', () => {
			const start = new Date('2024-01-01T12:00:00Z');
			const end = new Date('2024-01-01T10:00:00Z');

			expect(calculateDuration(start, end)).toBe(-2);
		});
	});

	describe('formatDate', () => {
		it('should format date to YYYY-MM-DD', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			expect(formatDate(date)).toBe('2024-01-15');
		});
	});

	describe('formatTime', () => {
		it('should format time in 24-hour format', () => {
			const date = new Date('2024-01-15T14:30:00Z');
			const formatted = formatTime(date, true);
			// Time formatting depends on system timezone, so just check format
			expect(formatted).toMatch(/\d{2}:\d{2}/);
		});
	});

	describe('addDays', () => {
		it('should add days to a date', () => {
			const date = new Date('2024-01-15');
			const result = addDays(date, 5);
			expect(formatDate(result)).toBe('2024-01-20');
		});

		it('should subtract days with negative input', () => {
			const date = new Date('2024-01-15');
			const result = addDays(date, -5);
			expect(formatDate(result)).toBe('2024-01-10');
		});
	});

	describe('isToday', () => {
		it('should return true for today\'s date', () => {
			const today = new Date();
			expect(isToday(today)).toBe(true);
		});

		it('should return false for yesterday', () => {
			const yesterday = addDays(new Date(), -1);
			expect(isToday(yesterday)).toBe(false);
		});
	});
});

describe('Validation Utilities', () => {
	describe('isValidEmail', () => {
		it('should validate correct email addresses', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
			expect(isValidEmail('user+tag@example.org')).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(isValidEmail('invalid-email')).toBe(false);
			expect(isValidEmail('@example.com')).toBe(false);
			expect(isValidEmail('test@')).toBe(false);
			expect(isValidEmail('test.example.com')).toBe(false);
			expect(isValidEmail('')).toBe(false);
		});
	});
});

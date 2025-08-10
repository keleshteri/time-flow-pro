/**
 * Date Utilities Tests
 *
 * Tests for date and time utility functions
 */

import { describe, it, expect } from 'vitest';
import { formatDuration, calculateDuration, isValidEmail } from './test-helpers';

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

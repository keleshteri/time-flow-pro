/**
 * Validation Utilities Tests
 * 
 * Comprehensive tests for validation functions
 */

import { describe, it, expect } from 'vitest';
import {
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
} from './validationUtils';

describe('Email Validation', () => {
	describe('isValidEmail', () => {
		it('should validate correct email addresses', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
			expect(isValidEmail('user+tag@example.org')).toBe(true);
			expect(isValidEmail('123@456.com')).toBe(true);
		});

		it('should reject invalid email addresses', () => {
			expect(isValidEmail('invalid-email')).toBe(false);
			expect(isValidEmail('@example.com')).toBe(false);
			expect(isValidEmail('test@')).toBe(false);
			expect(isValidEmail('test.example.com')).toBe(false);
			expect(isValidEmail('')).toBe(false);
			expect(isValidEmail('test@.com')).toBe(false);
		});
	});

	describe('validateEmail', () => {
		it('should return valid result for correct emails', () => {
			const result = validateEmail('test@example.com');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should return errors for invalid emails', () => {
			const result = validateEmail('invalid-email');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Please enter a valid email address');
		});

		it('should require email', () => {
			const result = validateEmail('');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Email is required');
		});

		it('should reject too long emails', () => {
			const longEmail = 'a'.repeat(250) + '@example.com';
			const result = validateEmail(longEmail);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Email address is too long (maximum 254 characters)');
		});
	});
});

describe('Password Validation', () => {
	describe('validatePassword', () => {
		it('should validate strong passwords', () => {
			const result = validatePassword('StrongPass123!');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should require minimum length', () => {
			const result = validatePassword('short', 8);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Password must be at least 8 characters long');
		});

		it('should reject too long passwords', () => {
			const longPassword = 'a'.repeat(130);
			const result = validatePassword(longPassword);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Password is too long (maximum 128 characters)');
		});

		it('should warn about missing character types', () => {
			const result = validatePassword('alllowercase');
			expect(result.isValid).toBe(true);
			expect(result.warnings).toContain('Password should contain at least one uppercase letter');
			expect(result.warnings).toContain('Password should contain at least one number');
		});

		it('should reject common passwords', () => {
			const result = validatePassword('password');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Password is too common and easily guessable');
		});
	});
});

describe('URL Validation', () => {
	describe('validateUrl', () => {
		it('should validate correct URLs', () => {
			const result = validateUrl('https://example.com');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept HTTP URLs when HTTPS not required', () => {
			const result = validateUrl('http://example.com', false);
			expect(result.isValid).toBe(true);
		});

		it('should reject HTTP URLs when HTTPS required', () => {
			const result = validateUrl('http://example.com', true);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('URL must use HTTPS protocol');
		});

		it('should reject invalid URLs', () => {
			const result = validateUrl('not-a-url');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Please enter a valid URL');
		});
	});
});

describe('Phone Validation', () => {
	describe('validatePhone', () => {
		it('should validate correct phone numbers', () => {
			expect(validatePhone('1234567890').isValid).toBe(true);
			expect(validatePhone('+1234567890').isValid).toBe(true);
			expect(validatePhone('123-456-7890').isValid).toBe(true);
		});

		it('should reject invalid phone numbers', () => {
			expect(validatePhone('123').isValid).toBe(false);
			expect(validatePhone('abc').isValid).toBe(false);
			expect(validatePhone('').isValid).toBe(false);
		});
	});
});

describe('Generic Validation Functions', () => {
	describe('validateRequired', () => {
		it('should validate non-empty values', () => {
			expect(validateRequired('test').isValid).toBe(true);
			expect(validateRequired(123).isValid).toBe(true);
			expect(validateRequired(['item']).isValid).toBe(true);
		});

		it('should reject empty values', () => {
			expect(validateRequired('').isValid).toBe(false);
			expect(validateRequired(null).isValid).toBe(false);
			expect(validateRequired(undefined).isValid).toBe(false);
			expect(validateRequired([]).isValid).toBe(false);
		});
	});

	describe('validateLength', () => {
		it('should validate correct length strings', () => {
			const result = validateLength('hello', 3, 10);
			expect(result.isValid).toBe(true);
		});

		it('should reject too short strings', () => {
			const result = validateLength('hi', 3, 10);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Field must be at least 3 characters long');
		});

		it('should reject too long strings', () => {
			const result = validateLength('very long string', 3, 10);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Field must be no more than 10 characters long');
		});
	});

	describe('validateNumber', () => {
		it('should validate numbers in range', () => {
			expect(validateNumber(5, 1, 10).isValid).toBe(true);
		});

		it('should reject numbers out of range', () => {
			expect(validateNumber(15, 1, 10).isValid).toBe(false);
			expect(validateNumber(-5, 1, 10).isValid).toBe(false);
		});

		it('should reject invalid numbers', () => {
			expect(validateNumber(NaN).isValid).toBe(false);
			expect(validateNumber(Infinity).isValid).toBe(false);
		});
	});

	describe('validateDate', () => {
		it('should validate correct dates', () => {
			const result = validateDate(new Date());
			expect(result.isValid).toBe(true);
		});

		it('should validate date strings', () => {
			const result = validateDate('2024-01-15');
			expect(result.isValid).toBe(true);
		});

		it('should reject invalid dates', () => {
			const result = validateDate('invalid-date');
			expect(result.isValid).toBe(false);
		});

		it('should check date ranges', () => {
			const today = new Date();
			const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
			const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

			expect(validateDate(today, yesterday, tomorrow).isValid).toBe(true);
			expect(validateDate(yesterday, today, tomorrow).isValid).toBe(false);
		});
	});
});

describe('Validation Rule Creators', () => {
	describe('required rule', () => {
		it('should create required validation rule', () => {
			const rule = required('This field is required');
			expect(rule('')).toBe('This field is required');
			expect(rule('value')).toBe(null);
		});
	});

	describe('minLength rule', () => {
		it('should create min length validation rule', () => {
			const rule = minLength(5);
			expect(rule('test')).toContain('Must be at least 5 characters');
			expect(rule('testing')).toBe(null);
		});
	});

	describe('email rule', () => {
		it('should create email validation rule', () => {
			const rule = email();
			expect(rule('invalid')).toContain('valid email address');
			expect(rule('test@example.com')).toBe(null);
		});
	});

	describe('pattern rule', () => {
		it('should create pattern validation rule', () => {
			const rule = pattern(/^\d+$/, 'Must be numbers only');
			expect(rule('abc')).toBe('Must be numbers only');
			expect(rule('123')).toBe(null);
		});
	});
});

describe('Composite Validation', () => {
	describe('createValidator', () => {
		it('should create validator from multiple rules', () => {
			const validator = createValidator([
				required(),
				minLength(3),
				email()
			]);

			expect(validator('').isValid).toBe(false);
			expect(validator('ab').isValid).toBe(false);
			expect(validator('test@example.com').isValid).toBe(true);
		});
	});

	describe('validateFields', () => {
		it('should validate multiple fields', () => {
			const fields = {
				email: 'test@example.com',
				name: 'John',
				age: 25
			};

			const validators = {
				email: createValidator([required(), email()]),
				name: createValidator([required(), minLength(2)]),
				age: (value: number) => validateNumber(value, 0, 120)
			};

			const results = validateFields(fields, validators);
			expect(allValid(results)).toBe(true);
		});
	});

	describe('allValid', () => {
		it('should check if all results are valid', () => {
			const results = [
				{ isValid: true, errors: [] },
				{ isValid: true, errors: [] }
			];
			expect(allValid(results)).toBe(true);

			results.push({ isValid: false, errors: ['Error'] });
			expect(allValid(results)).toBe(false);
		});
	});

	describe('getAllErrors', () => {
		it('should collect all errors', () => {
			const results = [
				{ isValid: false, errors: ['Error 1'] },
				{ isValid: false, errors: ['Error 2', 'Error 3'] }
			];
			const errors = getAllErrors(results);
			expect(errors).toEqual(['Error 1', 'Error 2', 'Error 3']);
		});
	});
});

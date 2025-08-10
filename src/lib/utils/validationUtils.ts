/**
 * TimeFlow Pro Validation Utilities
 * 
 * Comprehensive validation functions for forms, inputs, and data validation.
 * Provides type-safe validation with detailed error messages and custom rules.
 * 
 * @example
 * ```typescript
 * import { isValidEmail, validateProject, createValidator } from '$lib/utils/validationUtils';
 * 
 * const emailValid = isValidEmail('user@example.com'); // true
 * const projectErrors = validateProject(projectData); // ValidationResult
 * const customValidator = createValidator([required(), minLength(3)]);
 * ```
 */

// Validation result type
export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings?: string[];
}

// Validation rule type
export type ValidationRule<T = unknown> = (value: T) => string | null;

/**
 * Validate email format using RFC 5322 compliant regex
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email.trim());
}

/**
 * Validate email with detailed result
 * @param email - Email address to validate
 * @returns Validation result with errors
 */
export function validateEmail(email: string): ValidationResult {
	const errors: string[] = [];
	
	if (!email || email.trim().length === 0) {
		errors.push('Email is required');
	} else if (!isValidEmail(email)) {
		errors.push('Please enter a valid email address');
	} else if (email.length > 254) {
		errors.push('Email address is too long (maximum 254 characters)');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 8)
 * @returns Validation result with strength indicators
 */
export function validatePassword(password: string, minLength = 8): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];
	
	if (!password) {
		errors.push('Password is required');
		return { isValid: false, errors, warnings };
	}
	
	if (password.length < minLength) {
		errors.push(`Password must be at least ${minLength} characters long`);
	}
	
	if (password.length > 128) {
		errors.push('Password is too long (maximum 128 characters)');
	}
	
	// Check for common patterns
	if (!/[a-z]/.test(password)) {
		warnings.push('Password should contain at least one lowercase letter');
	}
	
	if (!/[A-Z]/.test(password)) {
		warnings.push('Password should contain at least one uppercase letter');
	}
	
	if (!/\d/.test(password)) {
		warnings.push('Password should contain at least one number');
	}
	
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		warnings.push('Password should contain at least one special character');
	}
	
	// Check for common weak passwords
	const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
	if (commonPasswords.includes(password.toLowerCase())) {
		errors.push('Password is too common and easily guessable');
	}
	
	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @param requireHttps - Require HTTPS protocol (default: false)
 * @returns Validation result
 */
export function validateUrl(url: string, requireHttps = false): ValidationResult {
	const errors: string[] = [];
	
	if (!url || url.trim().length === 0) {
		errors.push('URL is required');
		return { isValid: false, errors };
	}
	
	try {
		const urlObj = new URL(url);
		
		if (requireHttps && urlObj.protocol !== 'https:') {
			errors.push('URL must use HTTPS protocol');
		}
		
		if (!['http:', 'https:'].includes(urlObj.protocol)) {
			errors.push('URL must use HTTP or HTTPS protocol');
		}
		
	} catch {
		errors.push('Please enter a valid URL');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate phone number (basic international format)
 * @param phone - Phone number to validate
 * @returns Validation result
 */
export function validatePhone(phone: string): ValidationResult {
	const errors: string[] = [];
	
	if (!phone || phone.trim().length === 0) {
		errors.push('Phone number is required');
		return { isValid: false, errors };
	}
	
	// Remove all non-digit characters except + at the beginning
	const cleaned = phone.replace(/[^\d+]/g, '');
	
	// Basic validation: 7-15 digits, optional + at start
	const phoneRegex = /^\+?[\d]{7,15}$/;
	
	if (!phoneRegex.test(cleaned)) {
		errors.push('Please enter a valid phone number (7-15 digits)');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateRequired(value: unknown, fieldName = 'Field'): ValidationResult {
	const errors: string[] = [];
	
	if (value === null || value === undefined) {
		errors.push(`${fieldName} is required`);
	} else if (typeof value === 'string' && value.trim().length === 0) {
		errors.push(`${fieldName} is required`);
	} else if (Array.isArray(value) && value.length === 0) {
		errors.push(`${fieldName} must contain at least one item`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate string length
 * @param value - String to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateLength(
	value: string,
	minLength: number,
	maxLength: number,
	fieldName = 'Field'
): ValidationResult {
	const errors: string[] = [];
	
	if (value.length < minLength) {
		errors.push(`${fieldName} must be at least ${minLength} characters long`);
	}
	
	if (value.length > maxLength) {
		errors.push(`${fieldName} must be no more than ${maxLength} characters long`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate numeric value
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateNumber(
	value: number,
	min?: number,
	max?: number,
	fieldName = 'Value'
): ValidationResult {
	const errors: string[] = [];
	
	if (isNaN(value) || !isFinite(value)) {
		errors.push(`${fieldName} must be a valid number`);
		return { isValid: false, errors };
	}
	
	if (min !== undefined && value < min) {
		errors.push(`${fieldName} must be at least ${min}`);
	}
	
	if (max !== undefined && value > max) {
		errors.push(`${fieldName} must be no more than ${max}`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Validate date
 * @param date - Date to validate
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export function validateDate(
	date: Date | string,
	minDate?: Date,
	maxDate?: Date,
	fieldName = 'Date'
): ValidationResult {
	const errors: string[] = [];
	
	let dateObj: Date;
	
	if (typeof date === 'string') {
		dateObj = new Date(date);
	} else {
		dateObj = date;
	}
	
	if (isNaN(dateObj.getTime())) {
		errors.push(`${fieldName} must be a valid date`);
		return { isValid: false, errors };
	}
	
	if (minDate && dateObj < minDate) {
		errors.push(`${fieldName} must be after ${minDate.toLocaleDateString()}`);
	}
	
	if (maxDate && dateObj > maxDate) {
		errors.push(`${fieldName} must be before ${maxDate.toLocaleDateString()}`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

// Validation rule creators for composable validation
export const required = (message?: string): ValidationRule => (value: unknown) => {
	if (value === null || value === undefined || 
		(typeof value === 'string' && value.trim().length === 0)) {
		return message || 'This field is required';
	}
	return null;
};

export const minLength = (min: number, message?: string): ValidationRule<string> => (value: string) => {
	if (value && value.length < min) {
		return message || `Must be at least ${min} characters long`;
	}
	return null;
};

export const maxLength = (max: number, message?: string): ValidationRule<string> => (value: string) => {
	if (value && value.length > max) {
		return message || `Must be no more than ${max} characters long`;
	}
	return null;
};

export const email = (message?: string): ValidationRule<string> => (value: string) => {
	if (value && !isValidEmail(value)) {
		return message || 'Please enter a valid email address';
	}
	return null;
};

export const pattern = (regex: RegExp, message?: string): ValidationRule<string> => (value: string) => {
	if (value && !regex.test(value)) {
		return message || 'Invalid format';
	}
	return null;
};

/**
 * Create a validator function from multiple rules
 * @param rules - Array of validation rules
 * @returns Validator function
 */
export function createValidator<T>(rules: ValidationRule<T>[]): (value: T) => ValidationResult {
	return (value: T) => {
		const errors: string[] = [];
		
		for (const rule of rules) {
			const error = rule(value);
			if (error) {
				errors.push(error);
			}
		}
		
		return {
			isValid: errors.length === 0,
			errors
		};
	};
}

/**
 * Validate multiple fields at once
 * @param fields - Object with field names and values
 * @param validators - Object with field names and validator functions
 * @returns Object with validation results for each field
 */
export function validateFields<T extends Record<string, unknown>>(
	fields: T,
	validators: Partial<Record<keyof T, (value: T[keyof T]) => ValidationResult>>
): Record<keyof T, ValidationResult> {
	const results = {} as Record<keyof T, ValidationResult>;
	
	for (const [fieldName, value] of Object.entries(fields)) {
		const validator = validators[fieldName as keyof T];
		if (validator) {
			results[fieldName as keyof T] = validator(value);
		} else {
			results[fieldName as keyof T] = { isValid: true, errors: [] };
		}
	}
	
	return results;
}

/**
 * Check if all validation results are valid
 * @param results - Array or object of validation results
 * @returns True if all results are valid
 */
export function allValid(results: ValidationResult[] | Record<string, ValidationResult>): boolean {
	const resultArray = Array.isArray(results) ? results : Object.values(results);
	return resultArray.every(result => result.isValid);
}

/**
 * Get all errors from validation results
 * @param results - Array or object of validation results
 * @returns Array of all error messages
 */
export function getAllErrors(results: ValidationResult[] | Record<string, ValidationResult>): string[] {
	const resultArray = Array.isArray(results) ? results : Object.values(results);
	return resultArray.flatMap(result => result.errors);
}

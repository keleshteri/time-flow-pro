import { describe, it, expect } from 'vitest';
import Input from './Input.svelte';

describe('Input Component', () => {
	it('imports correctly', () => {
		expect(Input).toBeDefined();
		expect(typeof Input).toBe('function');
	});

	it('has correct component name', () => {
		expect(Input.name).toBe('Input');
	});
});
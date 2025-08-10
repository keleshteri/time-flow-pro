import { describe, it, expect } from 'vitest';
import Button from './Button.svelte';

describe('Button Component', () => {
	it('imports correctly', () => {
		expect(Button).toBeDefined();
		expect(typeof Button).toBe('function');
	});

	it('has correct component name', () => {
		expect(Button.name).toBe('Button');
	});
});
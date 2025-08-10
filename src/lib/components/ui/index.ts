/**
 * TimeFlow Pro UI Components
 * 
 * Central export point for all UI components in the TimeFlow Pro design system.
 * This provides a clean API for importing components throughout the application.
 * 
 * @example
 * ```typescript
 * import { Button, Input, Modal, Card } from '$lib/components/ui';
 * ```
 */

// Core UI Components
export { default as Button } from './Button.svelte';
export { default as Input } from './Input.svelte';
export { default as Modal } from './Modal.svelte';
export { default as Card } from './Card.svelte';

// Re-export component types for convenience
export type {
	ButtonProps,
	ButtonVariant,
	ButtonSize,
	ButtonType,
	InputProps,
	InputType,
	InputSize,
	InputVariant,
	ModalProps,
	ModalSize,
	CardProps,
	CardVariant,
	CardPadding
} from '$lib/types/components.js';

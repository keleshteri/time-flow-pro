/**
 * TimeFlow Pro UI Component Type Definitions
 *
 * Comprehensive TypeScript interfaces for all UI components
 * including accessibility, styling, and interaction properties.
 */

import type { ComponentEvents, ComponentProps } from 'svelte';

// Base component props that all components should extend
export interface BaseComponentProps {
	/** Additional CSS classes to apply */
	class?: string;
	/** Inline styles to apply */
	style?: string;
	/** Test ID for automated testing */
	'data-testid'?: string;
	/** ARIA label for accessibility */
	'aria-label'?: string;
	/** ARIA described by for accessibility */
	'aria-describedby'?: string;
}

// Button Component Types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends BaseComponentProps {
	/** Button visual variant */
	variant?: ButtonVariant;
	/** Button size */
	size?: ButtonSize;
	/** Button type attribute */
	type?: ButtonType;
	/** Whether button is disabled */
	disabled?: boolean;
	/** Whether button is in loading state */
	loading?: boolean;
	/** Loading text to show when loading */
	loadingText?: string;
	/** Whether button should take full width */
	fullWidth?: boolean;
	/** Icon to show before text */
	iconBefore?: string;
	/** Icon to show after text */
	iconAfter?: string;
	/** Whether to show only icon (no text) */
	iconOnly?: boolean;
	/** Click handler */
	onclick?: (event: MouseEvent) => void;
}

// Input Component Types
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success' | 'warning';

export interface InputProps extends BaseComponentProps {
	/** Input type */
	type?: InputType;
	/** Input size */
	size?: InputSize;
	/** Input visual variant */
	variant?: InputVariant;
	/** Input value */
	value?: string | number;
	/** Input placeholder */
	placeholder?: string;
	/** Input label */
	label?: string;
	/** Help text to show below input */
	helpText?: string;
	/** Error message to show */
	error?: string;
	/** Success message to show */
	success?: string;
	/** Warning message to show */
	warning?: string;
	/** Whether input is required */
	required?: boolean;
	/** Whether input is disabled */
	disabled?: boolean;
	/** Whether input is readonly */
	readonly?: boolean;
	/** Maximum length of input */
	maxlength?: number;
	/** Minimum length of input */
	minlength?: number;
	/** Pattern for validation */
	pattern?: string;
	/** Icon to show in input */
	icon?: string;
	/** Icon position */
	iconPosition?: 'left' | 'right';
	/** Autocomplete attribute */
	autocomplete?: string;
	/** Input change handler */
	oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
	/** Input blur handler */
	onblur?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
	/** Input focus handler */
	onfocus?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
}

// Modal Component Types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps extends BaseComponentProps {
	/** Whether modal is open */
	open?: boolean;
	/** Modal size */
	size?: ModalSize;
	/** Modal title */
	title?: string;
	/** Whether to show close button */
	showClose?: boolean;
	/** Whether clicking backdrop closes modal */
	closeOnBackdrop?: boolean;
	/** Whether pressing ESC closes modal */
	closeOnEscape?: boolean;
	/** Whether to prevent body scroll when open */
	preventScroll?: boolean;
	/** Close handler */
	onclose?: () => void;
	/** Open handler */
	onopen?: () => void;
}

// Card Component Types
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends BaseComponentProps {
	/** Card visual variant */
	variant?: CardVariant;
	/** Card padding */
	padding?: CardPadding;
	/** Whether card is clickable */
	clickable?: boolean;
	/** Whether card is selected */
	selected?: boolean;
	/** Whether card is disabled */
	disabled?: boolean;
	/** Card click handler */
	onclick?: (event: MouseEvent) => void;
}

// Form Validation Types
export interface ValidationRule {
	/** Validation function */
	validator: (value: unknown) => boolean | string;
	/** Error message if validation fails */
	message: string;
}

export interface FormFieldState {
	/** Field value */
	value: unknown;
	/** Whether field is valid */
	valid: boolean;
	/** Validation error message */
	error?: string;
	/** Whether field has been touched */
	touched: boolean;
	/** Whether field is currently being validated */
	validating: boolean;
}

// Theme and Design System Types
export interface ThemeColors {
	primary: string;
	secondary: string;
	success: string;
	warning: string;
	danger: string;
	info: string;
	light: string;
	dark: string;
}

export interface ComponentTheme {
	colors: ThemeColors;
	spacing: Record<string, string>;
	borderRadius: Record<string, string>;
	shadows: Record<string, string>;
	typography: Record<string, string>;
}

// Accessibility Types
export interface AccessibilityProps {
	/** ARIA role */
	role?: string;
	/** ARIA label */
	'aria-label'?: string;
	/** ARIA labelledby */
	'aria-labelledby'?: string;
	/** ARIA describedby */
	'aria-describedby'?: string;
	/** ARIA expanded */
	'aria-expanded'?: boolean;
	/** ARIA hidden */
	'aria-hidden'?: boolean;
	/** ARIA live region */
	'aria-live'?: 'off' | 'polite' | 'assertive';
	/** Tab index */
	tabindex?: number;
}

// Animation and Transition Types
export interface AnimationProps {
	/** Whether to animate component */
	animate?: boolean;
	/** Animation duration in milliseconds */
	duration?: number;
	/** Animation easing function */
	easing?: string;
	/** Animation delay in milliseconds */
	delay?: number;
}

// Responsive Design Types
export interface ResponsiveProps {
	/** Hide on mobile */
	hideMobile?: boolean;
	/** Hide on tablet */
	hideTablet?: boolean;
	/** Hide on desktop */
	hideDesktop?: boolean;
	/** Show only on mobile */
	mobileOnly?: boolean;
	/** Show only on tablet */
	tabletOnly?: boolean;
	/** Show only on desktop */
	desktopOnly?: boolean;
}

// Event Handler Types
export interface ComponentEventHandlers {
	onclick?: (event: MouseEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
	onfocus?: (event: FocusEvent) => void;
	onblur?: (event: FocusEvent) => void;
	onmouseenter?: (event: MouseEvent) => void;
	onmouseleave?: (event: MouseEvent) => void;
}

// Loading State Types
export interface LoadingProps {
	/** Whether component is in loading state */
	loading?: boolean;
	/** Loading text to display */
	loadingText?: string;
	/** Loading spinner size */
	loadingSize?: 'sm' | 'md' | 'lg';
}

// Icon Types
export interface IconProps extends BaseComponentProps {
	/** Icon name */
	name: string;
	/** Icon size */
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	/** Icon color */
	color?: string;
	/** Whether icon should spin */
	spin?: boolean;
}

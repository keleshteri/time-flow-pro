<!--
	TimeFlow Pro Button Component
	
	A comprehensive button component with multiple variants, sizes, and states.
	Includes full accessibility support, loading states, and icon integration.
	
	@component
	@example
	```svelte
	<Button variant="primary" size="md" onclick={handleClick}>
		Click me
	</Button>
	
	<Button variant="danger" loading loadingText="Deleting...">
		Delete
	</Button>
	
	<Button variant="ghost" iconBefore="plus" iconOnly aria-label="Add item" />
	```
-->

<script lang="ts">
	import type { ButtonProps } from '$lib/types/components.js';
	
	// Props with defaults
	export let variant: ButtonProps['variant'] = 'primary';
	export let size: ButtonProps['size'] = 'md';
	export let type: ButtonProps['type'] = 'button';
	export let disabled: ButtonProps['disabled'] = false;
	export let loading: ButtonProps['loading'] = false;
	export let loadingText: ButtonProps['loadingText'] = 'Loading...';
	export let fullWidth: ButtonProps['fullWidth'] = false;
	export let iconBefore: ButtonProps['iconBefore'] = undefined;
	export let iconAfter: ButtonProps['iconAfter'] = undefined;
	export let iconOnly: ButtonProps['iconOnly'] = false;
	
	// Base component props
	let className: ButtonProps['class'] = '';
	export { className as class };
	export let style: ButtonProps['style'] = '';
	export let onclick: ButtonProps['onclick'] = undefined;
	
	// Accessibility props
	export let ariaLabel: string | undefined = undefined;
	export let ariaDescribedby: string | undefined = undefined;
	
	// Computed classes based on variant and size
	$: variantClasses = {
		primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white border-transparent',
		secondary: 'bg-white hover:bg-gray-50 focus:ring-primary-500 text-gray-900 border-gray-300',
		danger: 'bg-danger-600 hover:bg-danger-700 focus:ring-danger-500 text-white border-transparent',
		ghost: 'bg-transparent hover:bg-gray-100 focus:ring-primary-500 text-gray-700 border-transparent',
		outline: 'bg-transparent hover:bg-primary-50 focus:ring-primary-500 text-primary-700 border-primary-300'
	}[variant];
	
	$: sizeClasses = {
		sm: 'px-3 py-1.5 text-sm font-medium',
		md: 'px-4 py-2 text-sm font-medium',
		lg: 'px-6 py-3 text-base font-medium'
	}[size];
	
	$: iconSizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	}[size];
	
	// Determine if button is effectively disabled
	$: isDisabled = disabled || loading;
	
	// Handle click events
	function handleClick(event: MouseEvent) {
		if (isDisabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}
	
	// Handle keyboard events for accessibility
	function handleKeydown(event: KeyboardEvent) {
		if (isDisabled) return;
		
		// Activate button on Enter or Space
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true
			});
			handleClick(clickEvent);
		}
	}
</script>

<button
	{type}
	class="
		inline-flex items-center justify-center
		border rounded-md
		transition-colors duration-200
		focus:outline-none focus:ring-2 focus:ring-offset-2
		disabled:opacity-50 disabled:cursor-not-allowed
		{variantClasses}
		{sizeClasses}
		{fullWidth ? 'w-full' : ''}
		{className}
	"
	{style}
	disabled={isDisabled}
	aria-label={ariaLabel}
	aria-describedby={ariaDescribedby}
	aria-disabled={isDisabled}
	on:click={handleClick}
	on:keydown={handleKeydown}
>
	<!-- Loading spinner -->
	{#if loading}
		<svg
			class="animate-spin -ml-1 mr-2 {iconSizeClasses}"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	
	<!-- Icon before text -->
	{#if iconBefore && !loading}
		<svg
			class="{iconSizeClasses} {iconOnly ? '' : 'mr-2'}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<!-- Icon paths would be dynamically loaded based on iconBefore prop -->
			<!-- For now, using a placeholder plus icon -->
			{#if iconBefore === 'plus'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
			{:else if iconBefore === 'edit'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
			{:else if iconBefore === 'trash'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
			{:else if iconBefore === 'save'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
			{/if}
		</svg>
	{/if}
	
	<!-- Button text -->
	{#if !iconOnly}
		<span class="truncate">
			{#if loading && loadingText}
				{loadingText}
			{:else}
				<slot />
			{/if}
		</span>
	{/if}
	
	<!-- Icon after text -->
	{#if iconAfter && !loading && !iconOnly}
		<svg
			class="{iconSizeClasses} ml-2"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<!-- Icon paths would be dynamically loaded based on iconAfter prop -->
			{#if iconAfter === 'arrow-right'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
			{:else if iconAfter === 'external-link'}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
			{/if}
		</svg>
	{/if}
</button>

<style>
	/* Dark mode styles */
	:global(.dark) button {
		/* Adjust colors for dark mode */
	}
	
	/* High contrast mode support */
	@media (prefers-contrast: high) {
		button {
			border-width: 2px;
		}
	}
	
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
		
		.animate-spin {
			animation: none;
		}
	}
</style>

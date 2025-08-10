<!--
	TimeFlow Pro Card Component
	
	A flexible card component with consistent spacing, elevation variants,
	and support for headers, footers, and interactive states.
	
	@component
	@example
	```svelte
	<Card variant="elevated" padding="lg">
		<svelte:fragment slot="header">
			<h3>Project Details</h3>
		</svelte:fragment>
		
		<p>Card content goes here...</p>
		
		<svelte:fragment slot="footer">
			<Button variant="primary">Action</Button>
		</svelte:fragment>
	</Card>
	
	<Card clickable onclick={handleCardClick}>
		<p>This card is clickable</p>
	</Card>
	```
-->

<script lang="ts">
	import type { CardProps } from '$lib/types/components.js';
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher<{
		click: { event: MouseEvent };
		keydown: { event: KeyboardEvent };
	}>();
	
	// Props with defaults
	export let variant: CardProps['variant'] = 'default';
	export let padding: CardProps['padding'] = 'md';
	export let clickable: CardProps['clickable'] = false;
	export let selected: CardProps['selected'] = false;
	export let disabled: CardProps['disabled'] = false;
	
	// Base component props
	let className: CardProps['class'] = '';
	export { className as class };
	export let style: CardProps['style'] = '';
	
	// Computed classes
	$: variantClasses = {
		default: 'bg-white border border-gray-200',
		outlined: 'bg-white border-2 border-gray-300',
		elevated: 'bg-white shadow-card border border-gray-100',
		filled: 'bg-gray-50 border border-gray-200'
	}[variant];
	
	$: paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	}[padding];
	
	$: interactiveClasses = clickable ? 
		'cursor-pointer transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : 
		'';
	
	$: stateClasses = selected ? 
		'ring-2 ring-primary-500 border-primary-300' : 
		disabled ? 
			'opacity-50 cursor-not-allowed' : 
			'';
	
	// Event handlers
	function handleClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		
		if (clickable) {
			dispatch('click', { event });
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;
		
		if (clickable && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			const clickEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true
			});
			handleClick(clickEvent);
		}
		
		dispatch('keydown', { event });
	}
</script>

<div
	class="
		rounded-lg
		{variantClasses}
		{interactiveClasses}
		{stateClasses}
		{className}
	"
	{style}
	role={clickable ? 'button' : undefined}
	tabindex={clickable && !disabled ? 0 : undefined}
	aria-disabled={disabled}
	aria-pressed={clickable && selected ? true : undefined}
	on:click={handleClick}
	on:keydown={handleKeydown}
>
	<!-- Card header -->
	{#if $$slots.header}
		<div class="
			{paddingClasses}
			{padding !== 'none' ? 'border-b border-gray-200 pb-3' : ''}
		">
			<slot name="header" />
		</div>
	{/if}
	
	<!-- Card body -->
	<div class="
		{paddingClasses}
		{$$slots.header && padding !== 'none' ? 'pt-3' : ''}
		{$$slots.footer && padding !== 'none' ? 'pb-3' : ''}
	">
		<slot />
	</div>
	
	<!-- Card footer -->
	{#if $$slots.footer}
		<div class="
			{paddingClasses}
			{padding !== 'none' ? 'border-t border-gray-200 pt-3' : ''}
		">
			<slot name="footer" />
		</div>
	{/if}
</div>

<style>
	/* Dark mode styles - using CSS custom properties instead of @apply */
	:global(.dark) .bg-white {
		background-color: #1f2937;
	}

	:global(.dark) .bg-gray-50 {
		background-color: #374151;
	}

	:global(.dark) .border-gray-200 {
		border-color: #4b5563;
	}

	:global(.dark) .border-gray-300 {
		border-color: #6b7280;
	}

	:global(.dark) .border-gray-100 {
		border-color: #374151;
	}
	
	/* High contrast mode support */
	@media (prefers-contrast: high) {
		div[role="button"] {
			border-width: 2px;
		}
		
		div[aria-pressed="true"] {
			border-width: 3px;
		}
	}
	
	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.transition-all {
			transition: none;
		}
	}
	
	/* Focus styles for better accessibility */
	div[role="button"]:focus {
		outline: 2px solid rgb(59 130 246);
		outline-offset: 2px;
	}
</style>

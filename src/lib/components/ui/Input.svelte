<!--
	TimeFlow Pro Input Component
	
	A comprehensive input component with validation states, icons, and accessibility.
	Supports various input types, validation feedback, and proper ARIA attributes.
	
	@component
	@example
	```svelte
	<Input
		label="Email Address"
		type="email"
		placeholder="Enter your email"
		required
		bind:value={email}
	/>
	
	<Input
		label="Password"
		type="password"
		error="Password must be at least 8 characters"
		bind:value={password}
	/>
	
	<Input
		label="Search"
		type="search"
		icon="search"
		iconPosition="left"
		bind:value={searchQuery}
	/>
	```
-->

<script lang="ts">
	import type { InputProps } from '$lib/types/components.js';
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher<{
		input: { value: string | number; event: Event };
		focus: { event: FocusEvent };
		blur: { event: FocusEvent };
		change: { value: string | number; event: Event };
	}>();
	
	// Props with defaults
	export let type: InputProps['type'] = 'text';
	export let size: InputProps['size'] = 'md';
	export let variant: InputProps['variant'] = 'default';
	export let value: InputProps['value'] = '';
	export let placeholder: InputProps['placeholder'] = '';
	export let label: InputProps['label'] = '';
	export let helpText: InputProps['helpText'] = '';
	export let error: InputProps['error'] = '';
	export let success: InputProps['success'] = '';
	export let warning: InputProps['warning'] = '';
	export let required: InputProps['required'] = false;
	export let disabled: InputProps['disabled'] = false;
	export let readonly: InputProps['readonly'] = false;
	export let maxlength: InputProps['maxlength'] = undefined;
	export let minlength: InputProps['minlength'] = undefined;
	export let pattern: InputProps['pattern'] = undefined;
	export let icon: InputProps['icon'] = undefined;
	export let iconPosition: InputProps['iconPosition'] = 'left';
	export let autocomplete: InputProps['autocomplete'] = undefined;
	
	// Base component props
	let className: InputProps['class'] = '';
	export { className as class };
	export let style: InputProps['style'] = '';
	
	// Generate unique IDs for accessibility
	const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
	const helpTextId = `${inputId}-help`;
	const errorId = `${inputId}-error`;
	
	// Determine current state
	$: currentVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant;
	$: hasMessage = !!(error || success || warning || helpText);
	
	// Computed classes
	$: containerClasses = `relative ${className}`;
	
	$: inputClasses = {
		base: 'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset transition-colors duration-200',
		size: {
			sm: 'text-sm py-1 px-2',
			md: 'text-sm py-1.5 px-3',
			lg: 'text-base py-2 px-4'
		}[size],
		variant: {
			default: 'ring-gray-300 focus:ring-primary-600 text-gray-900',
			error: 'ring-danger-300 focus:ring-danger-600 text-gray-900',
			success: 'ring-success-300 focus:ring-success-600 text-gray-900',
			warning: 'ring-warning-300 focus:ring-warning-600 text-gray-900'
		}[currentVariant],
		disabled: disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white',
		icon: icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
	};
	
	$: labelClasses = `block text-sm font-medium leading-6 ${
		currentVariant === 'error' ? 'text-danger-700' :
		currentVariant === 'success' ? 'text-success-700' :
		currentVariant === 'warning' ? 'text-warning-700' :
		'text-gray-900'
	}`;
	
	$: messageClasses = `mt-1 text-sm ${
		error ? 'text-danger-600' :
		success ? 'text-success-600' :
		warning ? 'text-warning-600' :
		'text-gray-500'
	}`;
	
	// Event handlers
	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		const target = event.currentTarget;
		value = type === 'number' ? target.valueAsNumber : target.value;
		dispatch('input', { value, event });
	}
	
	function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
		dispatch('focus', { event });
	}
	
	function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
		dispatch('blur', { event });
	}
	
	function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
		const target = event.currentTarget;
		value = type === 'number' ? target.valueAsNumber : target.value;
		dispatch('change', { value, event });
	}
</script>

<div class={containerClasses} {style}>
	<!-- Label -->
	{#if label}
		<label for={inputId} class={labelClasses}>
			{label}
			{#if required}
				<span class="text-danger-500 ml-1" aria-label="required">*</span>
			{/if}
		</label>
	{/if}
	
	<!-- Input container -->
	<div class="relative {label ? 'mt-2' : ''}">
		<!-- Left icon -->
		{#if icon && iconPosition === 'left'}
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg
					class="h-5 w-5 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{#if icon === 'search'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					{:else if icon === 'email'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
					{:else if icon === 'lock'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
					{:else if icon === 'user'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
					{/if}
				</svg>
			</div>
		{/if}
		
		<!-- Input element -->
		<input
			id={inputId}
			{type}
			{value}
			{placeholder}
			{required}
			{disabled}
			{readonly}
			{maxlength}
			{minlength}
			{pattern}
			{autocomplete}
			class="{inputClasses.base} {inputClasses.size} {inputClasses.variant} {inputClasses.disabled} {inputClasses.icon}"
			aria-describedby={hasMessage ? `${helpTextId} ${errorId}` : undefined}
			aria-invalid={!!error}
			on:input={handleInput}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:change={handleChange}
		/>
		
		<!-- Right icon -->
		{#if icon && iconPosition === 'right'}
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
				<svg
					class="h-5 w-5 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{#if icon === 'calendar'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					{:else if icon === 'clock'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					{/if}
				</svg>
			</div>
		{/if}
		
		<!-- Validation icon -->
		{#if currentVariant !== 'default'}
			<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none {icon && iconPosition === 'right' ? 'pr-10' : ''}">
				<svg
					class="h-5 w-5 {
						currentVariant === 'error' ? 'text-danger-500' :
						currentVariant === 'success' ? 'text-success-500' :
						currentVariant === 'warning' ? 'text-warning-500' : ''
					}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{#if currentVariant === 'error'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					{:else if currentVariant === 'success'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					{:else if currentVariant === 'warning'}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					{/if}
				</svg>
			</div>
		{/if}
	</div>
	
	<!-- Help text and validation messages -->
	{#if hasMessage}
		<div class={messageClasses}>
			{#if error}
				<p id={errorId} role="alert">{error}</p>
			{:else if success}
				<p id={helpTextId}>{success}</p>
			{:else if warning}
				<p id={helpTextId}>{warning}</p>
			{:else if helpText}
				<p id={helpTextId}>{helpText}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* High contrast mode support */
	@media (prefers-contrast: high) {
		input {
			border-width: 2px;
		}
	}
</style>

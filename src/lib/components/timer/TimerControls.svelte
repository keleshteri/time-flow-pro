<!--
	TimeFlow Pro Timer Controls Component
	
	Interactive timer controls with start/stop/pause/resume functionality,
	keyboard shortcuts, and accessibility support. Features visual feedback
	and loading states.
	
	@component
	@example
	```svelte
	<TimerControls 
		status="stopped"
		disabled={false}
		showLabels={true}
		on:start={() => console.log('Timer started')}
		on:stop={() => console.log('Timer stopped')}
		on:pause={() => console.log('Timer paused')}
		on:resume={() => console.log('Timer resumed')}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { TimerStatus } from '$lib/types/timer.js';
	import { Button } from '$lib/components/ui/index.js';

	// Props
	export let status: TimerStatus = 'stopped';
	export let disabled: boolean = false;
	export let showLabels: boolean = true;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'default' | 'minimal' | 'compact' = 'default';
	export let loading: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		start: void;
		stop: void;
		pause: void;
		resume: void;
		reset: void;
	}>();

	// Keyboard shortcut handling
	let keyboardEnabled = true;

	function handleKeydown(event: KeyboardEvent) {
		if (!keyboardEnabled || disabled || loading) return;

		// Prevent shortcuts when user is typing in inputs
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
			return;
		}

		switch (event.code) {
			case 'Space':
				event.preventDefault();
				if (status === 'stopped') {
					handleStart();
				} else if (status === 'running') {
					handleStop();
				}
				break;
			case 'KeyP':
				event.preventDefault();
				if (status === 'running') {
					handlePause();
				} else if (status === 'paused') {
					handleResume();
				}
				break;
			case 'KeyR':
				if (event.ctrlKey || event.metaKey) {
					event.preventDefault();
					handleReset();
				}
				break;
		}
	}

	// Control handlers
	function handleStart() {
		if (disabled || loading) return;
		dispatch('start');
	}

	function handleStop() {
		if (disabled || loading) return;
		dispatch('stop');
	}

	function handlePause() {
		if (disabled || loading) return;
		dispatch('pause');
	}

	function handleResume() {
		if (disabled || loading) return;
		dispatch('resume');
	}

	function handleReset() {
		if (disabled || loading) return;
		dispatch('reset');
	}

	// Button configurations based on status
	$: primaryButton = getPrimaryButtonConfig(status);
	$: secondaryButton = getSecondaryButtonConfig(status);

	function getPrimaryButtonConfig(currentStatus: TimerStatus) {
		switch (currentStatus) {
			case 'stopped':
				return {
					label: 'Start',
					icon: 'play',
					variant: 'primary' as const,
					action: handleStart,
					shortcut: 'Space'
				};
			case 'running':
				return {
					label: 'Stop',
					icon: 'stop',
					variant: 'danger' as const,
					action: handleStop,
					shortcut: 'Space'
				};
			case 'paused':
				return {
					label: 'Resume',
					icon: 'play',
					variant: 'primary' as const,
					action: handleResume,
					shortcut: 'Space'
				};
		}
	}

	function getSecondaryButtonConfig(currentStatus: TimerStatus) {
		switch (currentStatus) {
			case 'running':
				return {
					label: 'Pause',
					icon: 'pause',
					variant: 'secondary' as const,
					action: handlePause,
					shortcut: 'P'
				};
			case 'paused':
				return {
					label: 'Stop',
					icon: 'stop',
					variant: 'danger' as const,
					action: handleStop,
					shortcut: 'Space'
				};
			default:
				return null;
		}
	}

	// Component lifecycle
	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});

	// Disable keyboard shortcuts when component is disabled
	$: keyboardEnabled = !disabled && !loading;
</script>

<!-- Timer Controls -->
<div 
	class="timer-controls flex items-center gap-3"
	class:timer-controls--minimal={variant === 'minimal'}
	class:timer-controls--compact={variant === 'compact'}
	role="group"
	aria-label="Timer controls"
>
	<!-- Primary action button (Start/Stop/Resume) -->
	<Button
		variant={primaryButton.variant}
		size={size}
		disabled={disabled}
		loading={loading}
		onclick={primaryButton.action}
		aria-label="{primaryButton.label} timer (Shortcut: {primaryButton.shortcut})"
		class="timer-controls__primary"
	>
		{#if showLabels || variant !== 'compact'}
			{primaryButton.label}
		{/if}
		
		<!-- Keyboard shortcut hint -->
		{#if showLabels && variant === 'default'}
			<span class="ml-2 text-xs opacity-75">
				{primaryButton.shortcut}
			</span>
		{/if}
	</Button>

	<!-- Secondary action button (Pause when running, Stop when paused) -->
	{#if secondaryButton}
		<Button
			variant={secondaryButton.variant}
			size={size}
			disabled={disabled}
			loading={loading}
			onclick={secondaryButton.action}
			aria-label="{secondaryButton.label} timer (Shortcut: {secondaryButton.shortcut})"
			class="timer-controls__secondary"
		>
			{#if showLabels || variant !== 'compact'}
				{secondaryButton.label}
			{/if}
			
			<!-- Keyboard shortcut hint -->
			{#if showLabels && variant === 'default'}
				<span class="ml-2 text-xs opacity-75">
					{secondaryButton.shortcut}
				</span>
			{/if}
		</Button>
	{/if}

	<!-- Reset button (only show when timer has been used) -->
	{#if status !== 'stopped' || variant === 'default'}
		<Button
			variant="ghost"
			size={size}
			disabled={disabled}
			loading={loading}
			onclick={handleReset}
			aria-label="Reset timer (Shortcut: Ctrl+R)"
			class="timer-controls__reset"
			title="Reset timer"
		>
			{#if showLabels && variant === 'default'}
				Reset
				<span class="ml-2 text-xs opacity-75">
					Ctrl+R
				</span>
			{:else}
				<!-- Reset icon for compact mode -->
				<svg 
					class="w-4 h-4" 
					fill="none" 
					stroke="currentColor" 
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path 
						stroke-linecap="round" 
						stroke-linejoin="round" 
						stroke-width="2" 
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			{/if}
		</Button>
	{/if}
</div>

<!-- Keyboard shortcuts help (screen reader only) -->
<div class="sr-only" aria-live="polite">
	Timer keyboard shortcuts: Space to {status === 'stopped' ? 'start' : status === 'running' ? 'stop' : 'resume'}, 
	{#if status === 'running'}P to pause, {/if}Ctrl+R to reset
</div>

<style>
	.timer-controls {
		/* Ensure consistent button alignment */
		align-items: stretch;
	}

	.timer-controls--minimal {
		gap: 0.5rem;
	}

	.timer-controls--compact {
		gap: 0.25rem;
	}

	/* Focus management for keyboard navigation */
	.timer-controls:focus-within {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
		border-radius: 6px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.timer-controls {
			flex-direction: column;
			width: 100%;
		}

		.timer-controls :global(.timer-controls__primary),
		.timer-controls :global(.timer-controls__secondary) {
			width: 100%;
		}

		.timer-controls :global(.timer-controls__reset) {
			align-self: center;
			width: auto;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.timer-controls :global(button) {
			border-width: 2px;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.timer-controls :global(button) {
			transition: none;
		}
	}
</style>

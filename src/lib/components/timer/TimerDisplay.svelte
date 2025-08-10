<!--
	TimeFlow Pro Timer Display Component
	
	A high-precision timer display with real-time updates, multiple format options,
	and accessibility support. Features smooth animations and color-coded status.
	
	@component
	@example
	```svelte
	<TimerDisplay 
		elapsed={3665} 
		status="running"
		format="HH:MM:SS"
		showMilliseconds={false}
		colorScheme="default"
	/>
	```
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { TimerStatus, TimerDisplayOptions } from '$lib/types/timer.js';
	import { 
		formatTimerDisplay, 
		formatTimerCompact, 
		formatTimeForAccessibility,
		getTimerDisplayColor,
		interpolateTimerValue
	} from '$lib/utils/time-utils.js';

	// Props
	export let elapsed: number = 0;
	export let status: TimerStatus = 'stopped';
	export let format: TimerDisplayOptions['format'] = 'HH:MM:SS';
	export let showSeconds: boolean = true;
	export let showMilliseconds: boolean = false;
	export let colorScheme: TimerDisplayOptions['colorScheme'] = 'default';
	export let compact: boolean = false;
	export let animate: boolean = true;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

	// Component state
	let displayValue = elapsed;
	let animationFrame: number | null = null;
	let lastUpdateTime = performance.now();

	// Reactive values
	$: displayOptions = { format, showSeconds, showMilliseconds };
	$: formattedTime = compact 
		? formatTimerCompact(displayValue, showSeconds)
		: formatTimerDisplay(displayValue, displayOptions);
	$: accessibilityText = formatTimeForAccessibility(displayValue);
	$: colorClass = getTimerDisplayColor(displayValue, status);
	$: sizeClasses = getSizeClasses(size);

	// Smooth animation for timer updates
	function updateDisplayValue() {
		if (!animate) {
			displayValue = elapsed;
			return;
		}

		const now = performance.now();
		const deltaTime = (now - lastUpdateTime) / 1000;
		lastUpdateTime = now;

		// Interpolate towards target value for smooth animation
		displayValue = interpolateTimerValue(displayValue, elapsed, 0.2);

		// Continue animation if values don't match
		if (Math.abs(displayValue - elapsed) > 0.01) {
			animationFrame = requestAnimationFrame(updateDisplayValue);
		} else {
			displayValue = elapsed;
		}
	}

	// Watch for elapsed time changes
	$: if (elapsed !== displayValue) {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		lastUpdateTime = performance.now();
		updateDisplayValue();
	}

	// Size class mapping
	function getSizeClasses(size: string): string {
		const baseClasses = 'font-mono font-bold tabular-nums';
		
		switch (size) {
			case 'sm':
				return `${baseClasses} text-lg`;
			case 'md':
				return `${baseClasses} text-2xl`;
			case 'lg':
				return `${baseClasses} text-4xl`;
			case 'xl':
				return `${baseClasses} text-6xl`;
			default:
				return `${baseClasses} text-2xl`;
		}
	}

	// Color scheme classes
	$: schemeClasses = getSchemeClasses(colorScheme, status);

	function getSchemeClasses(scheme: string, currentStatus: TimerStatus): string {
		const base = colorClass;
		
		switch (scheme) {
			case 'minimal':
				return currentStatus === 'running' ? 'text-gray-900' : 'text-gray-500';
			case 'colorful':
				return `${base} drop-shadow-sm`;
			default:
				return base;
		}
	}

	// Status indicator classes
	$: statusClasses = getStatusClasses(status);

	function getStatusClasses(currentStatus: TimerStatus): string {
		switch (currentStatus) {
			case 'running':
				return 'animate-pulse';
			case 'paused':
				return 'opacity-75';
			case 'stopped':
				return 'opacity-50';
			default:
				return '';
		}
	}

	// Cleanup animation frame on destroy
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<!-- Timer Display -->
<div 
	class="timer-display flex items-center justify-center"
	role="timer"
	aria-live="polite"
	aria-label="Timer: {accessibilityText}"
>
	<!-- Main time display -->
	<time 
		class="{sizeClasses} {schemeClasses} {statusClasses} transition-all duration-200 ease-in-out"
		datetime="PT{Math.floor(displayValue)}S"
		title="{accessibilityText}"
	>
		{formattedTime}
	</time>

	<!-- Status indicator -->
	{#if status === 'running'}
		<div 
			class="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"
			aria-label="Timer is running"
		></div>
	{:else if status === 'paused'}
		<div 
			class="ml-2 w-2 h-2 bg-yellow-500 rounded-full"
			aria-label="Timer is paused"
		></div>
	{/if}
</div>

<style>
	.timer-display {
		/* Ensure consistent spacing for tabular numbers */
		font-variant-numeric: tabular-nums;
	}

	/* Smooth transitions for color changes */
	time {
		transition-property: color, opacity, transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		time {
			transition: none;
		}
		
		.animate-pulse {
			animation: none;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		time {
			font-weight: 900;
		}
	}

	/* Focus styles for keyboard navigation */
	.timer-display:focus-within time {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
		border-radius: 4px;
	}
</style>

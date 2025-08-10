<!--
	TimeFlow Pro Timer Widget Component
	
	Complete timer interface combining display and controls with project/task integration,
	persistence, accuracy monitoring, and real-time updates. The main timer component
	for the TimeFlow Pro application.
	
	@component
	@example
	```svelte
	<TimerWidget 
		projectId="project-123"
		taskId="task-456"
		autoSave={true}
		showAccuracy={true}
		on:started={(e) => console.log('Timer started:', e.detail)}
		on:stopped={(e) => console.log('Time entry created:', e.detail)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { timerStore, currentElapsed, hasActiveTimer } from '$lib/stores/timerStore.js';
	import { timerService } from '$lib/services/timer-service.js';
	import { eventBus } from '$lib/utils/eventBus.js';
	import { validateAccuracy } from '$lib/utils/time-utils.js';
	import type { TimerStatus, TimerAccuracyMetrics } from '$lib/types/timer.js';
	import TimerDisplay from './TimerDisplay.svelte';
	import TimerControls from './TimerControls.svelte';
	import { Card } from '$lib/components/ui/index.js';

	// Props
	export let projectId: string | null = null;
	export let taskId: string | null = null;
	export let description: string = '';
	export let autoSave: boolean = true;
	export let showAccuracy: boolean = false;
	export let showProjectInfo: boolean = true;
	export let compact: boolean = false;
	export let disabled: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		started: { projectId?: string; taskId?: string; timestamp: Date };
		stopped: { duration: number; projectId?: string; taskId?: string; timestamp: Date };
		paused: { timestamp: Date };
		resumed: { timestamp: Date };
		accuracyWarning: { metrics: TimerAccuracyMetrics };
	}>();

	// Component state
	let timerState = timerStore.getCurrentState();
	let accuracyMetrics: TimerAccuracyMetrics | null = null;
	let isInitialized = false;
	let saveTimeout: number | null = null;

	// Reactive values
	$: status = timerState.status;
	$: elapsed = $currentElapsed;
	$: isActive = $hasActiveTimer;

	// Timer control handlers
	async function handleStart() {
		try {
			timerStore.start({
				projectId: projectId || undefined,
				taskId: taskId || undefined,
				description
			});

			const state = timerStore.getCurrentState();
			dispatch('started', {
				projectId: state.projectId || undefined,
				taskId: state.taskId || undefined,
				timestamp: new Date()
			});

			// Auto-save if enabled
			if (autoSave) {
				scheduleAutoSave();
			}
		} catch (error) {
			console.error('Failed to start timer:', error);
		}
	}

	async function handleStop() {
		try {
			const currentState = timerStore.getCurrentState();
			timerStore.stop();

			dispatch('stopped', {
				duration: currentState.elapsedTime,
				projectId: currentState.projectId || undefined,
				taskId: currentState.taskId || undefined,
				timestamp: new Date()
			});

			// Save final state
			if (autoSave) {
				await saveTimerState();
			}
		} catch (error) {
			console.error('Failed to stop timer:', error);
		}
	}

	async function handlePause() {
		try {
			timerStore.pause();
			dispatch('paused', { timestamp: new Date() });

			// Save paused state
			if (autoSave) {
				await saveTimerState();
			}
		} catch (error) {
			console.error('Failed to pause timer:', error);
		}
	}

	async function handleResume() {
		try {
			timerStore.resume();
			dispatch('resumed', { timestamp: new Date() });

			// Resume auto-save
			if (autoSave) {
				scheduleAutoSave();
			}
		} catch (error) {
			console.error('Failed to resume timer:', error);
		}
	}

	async function handleReset() {
		try {
			timerStore.reset();
			accuracyMetrics = null;

			// Clear saved state
			if (autoSave) {
				await saveTimerState();
			}
		} catch (error) {
			console.error('Failed to reset timer:', error);
		}
	}

	// Auto-save functionality
	function scheduleAutoSave() {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		saveTimeout = setTimeout(async () => {
			await saveTimerState();
			if (status === 'running') {
				scheduleAutoSave(); // Continue auto-save while running
			}
		}, 5000); // Save every 5 seconds
	}

	async function saveTimerState() {
		try {
			const state = timerStore.getCurrentState();
			await timerService.saveState(state);
		} catch (error) {
			console.error('Failed to save timer state:', error);
		}
	}

	// Accuracy monitoring
	function checkAccuracy() {
		if (!showAccuracy || status !== 'running') return;

		const state = timerStore.getCurrentState();
		if (!state.startTime) return;

		const metrics = validateAccuracy(state.startTime, state.elapsedTime);
		accuracyMetrics = metrics;

		if (!metrics.isAccurate) {
			dispatch('accuracyWarning', { metrics });
		}
	}

	// Event bus listeners
	function setupEventListeners() {
		eventBus.on('timer:auto-save-requested', saveTimerState);
		eventBus.on('timer:accuracy-check-requested', checkAccuracy);
	}

	function cleanupEventListeners() {
		eventBus.off('timer:auto-save-requested', saveTimerState);
		eventBus.off('timer:accuracy-check-requested', checkAccuracy);
	}

	// Subscribe to timer store changes
	const unsubscribe = timerStore.subscribe((state) => {
		timerState = state;
	});

	// Component lifecycle
	onMount(async () => {
		try {
			// Initialize timer service
			await timerService.initialize();
			
			// Set up event listeners
			setupEventListeners();
			
			// Update context if provided
			if (projectId || taskId || description) {
				timerStore.updateContext(projectId || undefined, taskId || undefined, description);
			}

			isInitialized = true;
		} catch (error) {
			console.error('Failed to initialize timer widget:', error);
			isInitialized = true; // Continue without service
		}
	});

	onDestroy(() => {
		// Cleanup subscriptions and timers
		unsubscribe();
		cleanupEventListeners();
		
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}
	});

	// Update context when props change
	$: if (isInitialized && (projectId || taskId || description)) {
		timerStore.updateContext(projectId || undefined, taskId || undefined, description);
	}
</script>

<!-- Timer Widget -->
<Card class="timer-widget {compact ? 'timer-widget--compact' : ''}" padding={compact ? 'sm' : 'md'}>
	<!-- Project/Task Info -->
	{#if showProjectInfo && !compact && (projectId || taskId)}
		<div class="timer-widget__context mb-4 text-sm text-gray-600">
			{#if projectId}
				<span class="font-medium">Project:</span> {projectId}
			{/if}
			{#if taskId}
				<span class="ml-4 font-medium">Task:</span> {taskId}
			{/if}
		</div>
	{/if}

	<!-- Timer Display -->
	<div class="timer-widget__display mb-6">
		<TimerDisplay 
			{elapsed}
			{status}
			size={compact ? 'md' : 'lg'}
			{compact}
			animate={true}
		/>
	</div>

	<!-- Timer Controls -->
	<div class="timer-widget__controls">
		<TimerControls 
			{status}
			{disabled}
			size={compact ? 'sm' : 'md'}
			variant={compact ? 'compact' : 'default'}
			showLabels={!compact}
			on:start={handleStart}
			on:stop={handleStop}
			on:pause={handlePause}
			on:resume={handleResume}
			on:reset={handleReset}
		/>
	</div>

	<!-- Accuracy Indicator -->
	{#if showAccuracy && accuracyMetrics && status === 'running'}
		<div class="timer-widget__accuracy mt-4 text-xs">
			{#if accuracyMetrics.isAccurate}
				<span class="text-green-600">✓ Accurate</span>
			{:else}
				<span class="text-orange-600">⚠ Drift: {accuracyMetrics.drift.toFixed(1)}s</span>
			{/if}
		</div>
	{/if}

	<!-- Description -->
	{#if description && !compact}
		<div class="timer-widget__description mt-4 text-sm text-gray-700">
			{description}
		</div>
	{/if}
</Card>

<style>
	.timer-widget {
		min-width: 280px;
		text-align: center;
	}

	.timer-widget--compact {
		min-width: 200px;
	}

	.timer-widget__display {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timer-widget__controls {
		display: flex;
		justify-content: center;
	}

	.timer-widget__context {
		text-align: left;
		padding: 0.5rem;
		background-color: var(--color-gray-50);
		border-radius: 0.375rem;
	}

	.timer-widget__accuracy {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
	}

	.timer-widget__description {
		text-align: center;
		font-style: italic;
		max-width: 100%;
		word-wrap: break-word;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.timer-widget {
			min-width: unset;
			width: 100%;
		}

		.timer-widget__context {
			text-align: center;
		}
	}

	/* Focus management */
	.timer-widget:focus-within {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.timer-widget__context {
			border: 1px solid var(--color-gray-300);
		}
	}
</style>

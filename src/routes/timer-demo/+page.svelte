<!--
	Timer Demo Page - TimeFlow Pro
	
	Demonstrates the complete timer functionality including:
	- TimerWidget with all features
	- Individual timer components
	- Time formatting utilities
	- Keyboard shortcuts
	- Persistence and accuracy monitoring
-->

<script lang="ts">
	import { Button, Card } from '$lib/components/ui/index.js';
	import { TimerWidget, TimerDisplay, TimerControls } from '$lib/components/timer/index.js';
	import { timerStore, currentElapsed } from '$lib/stores/timerStore.js';
	import { formatTimerDisplay } from '$lib/utils/time-utils.js';

	// Demo timer event handlers
	function handleTimerStarted(event: CustomEvent) {
		console.log('Timer started:', event.detail);
	}

	function handleTimerStopped(event: CustomEvent) {
		console.log('Timer stopped:', event.detail);
	}

	function handleTimerPaused(event: CustomEvent) {
		console.log('Timer paused:', event.detail);
	}

	function handleTimerResumed(event: CustomEvent) {
		console.log('Timer resumed:', event.detail);
	}

	function handleAccuracyWarning(event: CustomEvent) {
		console.warn('Timer accuracy warning:', event.detail);
	}
</script>

<svelte:head>
	<title>Timer Demo - TimeFlow Pro</title>
	<meta name="description" content="Interactive demo of TimeFlow Pro's timer functionality" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">
			TimeFlow Pro - Timer Demo
		</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			Professional time tracking with real-time updates, persistence, and accuracy monitoring.
		</p>
	</div>

	<!-- Main Timer Widget -->
	<div class="max-w-md mx-auto mb-12">
		<TimerWidget
			projectId="demo-project"
			taskId="demo-task"
			description="Demo timer session"
			autoSave={true}
			showAccuracy={true}
			on:started={handleTimerStarted}
			on:stopped={handleTimerStopped}
			on:paused={handleTimerPaused}
			on:resumed={handleTimerResumed}
			on:accuracyWarning={handleAccuracyWarning}
		/>
	</div>

	<!-- Timer Components Demo -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
		<Card>
			<h3 class="text-lg font-semibold mb-4">Timer Display</h3>
			<div class="space-y-4">
				<div>
					<p class="text-sm text-gray-600 mb-2">Default Format:</p>
					<TimerDisplay elapsed={$currentElapsed} status="running" />
				</div>
				<div>
					<p class="text-sm text-gray-600 mb-2">Compact Format:</p>
					<TimerDisplay elapsed={$currentElapsed} status="running" compact={true} size="sm" />
				</div>
				<div>
					<p class="text-sm text-gray-600 mb-2">Large Display:</p>
					<TimerDisplay elapsed={$currentElapsed} status="running" size="lg" />
				</div>
			</div>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-4">Timer Controls</h3>
			<div class="space-y-4">
				<div>
					<p class="text-sm text-gray-600 mb-2">Default Controls:</p>
					<TimerControls 
						status="stopped"
						on:start={() => timerStore.start()}
						on:stop={() => timerStore.stop()}
						on:pause={() => timerStore.pause()}
						on:resume={() => timerStore.resume()}
						on:reset={() => timerStore.reset()}
					/>
				</div>
				<div>
					<p class="text-sm text-gray-600 mb-2">Compact Controls:</p>
					<TimerControls 
						status="running"
						variant="compact"
						size="sm"
						showLabels={false}
						on:start={() => timerStore.start()}
						on:stop={() => timerStore.stop()}
						on:pause={() => timerStore.pause()}
						on:resume={() => timerStore.resume()}
						on:reset={() => timerStore.reset()}
					/>
				</div>
			</div>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-4">Time Formatting</h3>
			<div class="space-y-2 text-sm">
				<div>
					<span class="text-gray-600">HH:MM:SS:</span>
					<span class="ml-2 font-mono">{formatTimerDisplay($currentElapsed)}</span>
				</div>
				<div>
					<span class="text-gray-600">HH:MM:</span>
					<span class="ml-2 font-mono">{formatTimerDisplay($currentElapsed, { showSeconds: false })}</span>
				</div>
				<div>
					<span class="text-gray-600">Decimal:</span>
					<span class="ml-2 font-mono">{formatTimerDisplay($currentElapsed, { format: 'decimal' })} hours</span>
				</div>
				<div>
					<span class="text-gray-600">With milliseconds:</span>
					<span class="ml-2 font-mono">{formatTimerDisplay($currentElapsed, { showMilliseconds: true })}</span>
				</div>
			</div>
		</Card>
	</div>

	<!-- Features Overview -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
		<Card>
			<h3 class="text-lg font-semibold mb-2">✨ Real-Time Updates</h3>
			<p class="text-gray-600 mb-4">
				Precise timer with 1-second accuracy and smooth animations.
			</p>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-2">💾 Auto-Persistence</h3>
			<p class="text-gray-600 mb-4">
				Automatic saving to localStorage with IndexedDB backup.
			</p>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-2">🔄 Session Recovery</h3>
			<p class="text-gray-600 mb-4">
				Recovers timer state after browser crashes or refreshes.
			</p>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-2">⌨️ Keyboard Shortcuts</h3>
			<p class="text-gray-600 mb-4">
				Space to start/stop, P to pause, Ctrl+R to reset.
			</p>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-2">📊 Accuracy Monitoring</h3>
			<p class="text-gray-600 mb-4">
				Drift detection and compensation for 24+ hour sessions.
			</p>
		</Card>

		<Card>
			<h3 class="text-lg font-semibold mb-2">♿ Accessibility</h3>
			<p class="text-gray-600 mb-4">
				Full screen reader support and keyboard navigation.
			</p>
		</Card>
	</div>

	<!-- Keyboard Shortcuts Guide -->
	<Card class="mb-8">
		<h3 class="text-lg font-semibold mb-4">⌨️ Keyboard Shortcuts</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
			<div class="flex items-center">
				<kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono mr-2">Space</kbd>
				<span>Start/Stop Timer</span>
			</div>
			<div class="flex items-center">
				<kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono mr-2">P</kbd>
				<span>Pause/Resume Timer</span>
			</div>
			<div class="flex items-center">
				<kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono mr-2">Ctrl+R</kbd>
				<span>Reset Timer</span>
			</div>
		</div>
	</Card>

	<!-- Technical Details -->
	<Card class="mb-8">
		<h3 class="text-lg font-semibold mb-4">🔧 Technical Implementation</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
			<div>
				<h4 class="font-medium mb-2">Timer Engine:</h4>
				<ul class="space-y-1 text-gray-600">
					<li>• Svelte reactive stores for state management</li>
					<li>• setInterval with 1000ms precision</li>
					<li>• Drift compensation using performance.now()</li>
					<li>• Automatic cleanup on component destroy</li>
				</ul>
			</div>
			<div>
				<h4 class="font-medium mb-2">Persistence:</h4>
				<ul class="space-y-1 text-gray-600">
					<li>• Primary: localStorage for fast access</li>
					<li>• Backup: IndexedDB for reliability</li>
					<li>• Auto-save every 5 seconds</li>
					<li>• Session recovery after crashes</li>
				</ul>
			</div>
		</div>
	</Card>

	<div class="text-center">
		<p class="text-gray-500 mb-4">
			Built with SvelteKit 2.0, TypeScript 5.5, and TailwindCSS 3.4
		</p>
		<Button variant="secondary" onclick={() => window.history.back()}>
			← Back to Dashboard
		</Button>
	</div>
</div>

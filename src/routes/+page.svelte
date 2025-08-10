<!--
	Dashboard Page - TimeFlow Pro

	This is the main dashboard showing:
	- Quick timer access
	- Today's summary
	- Recent activity
	- Key metrics
	- Quick actions
-->

<script lang="ts">
	// Dashboard logic will be implemented here
	const todayHours = $state(0);
	const weekHours = $state(0);
	const activeProjects = $state(0);
	const pendingTasks = $state(0);
</script>

<svelte:head>
	<title>Dashboard - TimeFlow Pro</title>
	<meta name="description" content="Your professional time tracking dashboard" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Welcome Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome to TimeFlow Pro</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">
			Professional time tracking and billing management made simple.
		</p>
	</div>

	<!-- Quick Stats -->
	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Today's Hours -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div
						class="bg-primary-100 dark:bg-primary-900 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<svg
							class="text-primary-600 dark:text-primary-400 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
					<p class="timer-display text-2xl font-bold text-gray-900 dark:text-white">
						{todayHours.toFixed(1)}h
					</p>
				</div>
			</div>
		</div>

		<!-- This Week -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div
						class="bg-success-100 dark:bg-success-900 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<svg
							class="text-success-600 dark:text-success-400 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
					<p class="timer-display text-2xl font-bold text-gray-900 dark:text-white">
						{weekHours.toFixed(1)}h
					</p>
				</div>
			</div>
		</div>

		<!-- Active Projects -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div
						class="bg-warning-100 dark:bg-warning-900 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<svg
							class="text-warning-600 dark:text-warning-400 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{activeProjects}
					</p>
				</div>
			</div>
		</div>

		<!-- Pending Tasks -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div
						class="bg-danger-100 dark:bg-danger-900 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<svg
							class="text-danger-600 dark:text-danger-400 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
							/>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
					<p class="text-2xl font-bold text-gray-900 dark:text-white">
						{pendingTasks}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Quick Timer -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Timer</h2>
			<div class="text-center">
				<div class="timer-display mb-4 font-mono text-4xl font-bold text-gray-900 dark:text-white">
					00:00:00
				</div>
				<div class="flex justify-center space-x-4">
					<button
						class="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 font-medium text-white transition-colors"
					>
						Start Timer
					</button>
					<a
						href="/timer"
						class="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
					>
						Full Timer
					</a>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="shadow-card rounded-lg bg-white p-6 dark:bg-gray-800">
			<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
			<div class="space-y-3">
				<p class="py-8 text-center text-gray-600 dark:text-gray-400">
					No recent activity. Start tracking time to see your activity here.
				</p>
			</div>
		</div>
	</div>

	<!-- Getting Started -->
	<div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
		<h2 class="text-primary-900 dark:text-primary-100 mb-4 text-lg font-semibold">
			Getting Started with TimeFlow Pro
		</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="flex items-start space-x-3">
				<div
					class="bg-primary-600 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
				>
					1
				</div>
				<div>
					<h3 class="text-primary-900 dark:text-primary-100 font-medium">Create a Project</h3>
					<p class="text-primary-700 dark:text-primary-300 text-sm">
						Set up your first project to organize your time tracking.
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-3">
				<div
					class="bg-primary-600 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
				>
					2
				</div>
				<div>
					<h3 class="text-primary-900 dark:text-primary-100 font-medium">Start Tracking</h3>
					<p class="text-primary-700 dark:text-primary-300 text-sm">
						Use the timer to track time spent on tasks and projects.
					</p>
				</div>
			</div>
			<div class="flex items-start space-x-3">
				<div
					class="bg-primary-600 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
				>
					3
				</div>
				<div>
					<h3 class="text-primary-900 dark:text-primary-100 font-medium">Generate Reports</h3>
					<p class="text-primary-700 dark:text-primary-300 text-sm">
						Create professional reports for billing and analysis.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

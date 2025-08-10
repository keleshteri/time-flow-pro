<!--
	Root Layout - TimeFlow Pro

	This layout provides:
	- Global CSS imports
	- Navigation structure
	- Theme management
	- Error boundaries
	- Accessibility features
-->

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	const { children } = $props();

	// Theme management
	let isDarkMode = $state(false);

	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	// Initialize theme on mount
	$effect(() => {
		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);

		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
	<!-- Skip to main content for accessibility -->
	<a
		href="#main-content"
		class="bg-primary-600 sr-only z-50 rounded-md px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
	>
		Skip to main content
	</a>

	<!-- Navigation Header -->
	<header class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo and Brand -->
				<div class="flex items-center">
					<a href="/" class="flex items-center space-x-2">
						<div class="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-lg">
							<span class="text-sm font-bold text-white">TF</span>
						</div>
						<span class="text-xl font-bold text-gray-900 dark:text-white"> TimeFlow Pro </span>
					</a>
				</div>

				<!-- Navigation Links -->
				<nav class="hidden space-x-8 md:flex" aria-label="Main navigation">
					<a
						href="/"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Dashboard
					</a>
					<a
						href="/timer"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Timer
					</a>
					<a
						href="/tasks"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Tasks
					</a>
					<a
						href="/projects"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Projects
					</a>
					<a
						href="/billing"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Billing
					</a>
					<a
						href="/reports"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300"
					>
						Reports
					</a>
				</nav>

				<!-- Theme Toggle and Settings -->
				<div class="flex items-center space-x-4">
					<!-- Dark Mode Toggle -->
					<button
						onclick={toggleDarkMode}
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md p-2 text-gray-600 transition-colors dark:text-gray-300"
						aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
					>
						{#if isDarkMode}
							<!-- Sun icon -->
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						{:else}
							<!-- Moon icon -->
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
								/>
							</svg>
						{/if}
					</button>

					<!-- Settings Link -->
					<a
						href="/settings"
						class="hover:text-primary-600 dark:hover:text-primary-400 rounded-md p-2 text-gray-600 transition-colors dark:text-gray-300"
						aria-label="Settings"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main id="main-content" class="flex-1">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
				<p>&copy; 2024 TimeFlow Pro. Professional time tracking made simple.</p>
				<p>Version 2.0.0</p>
			</div>
		</div>
	</footer>
</div>

# Design Document - TimeFlow Pro (SvelteKit)

## Overview

TimeFlow Pro is designed as a modern SvelteKit application using TypeScript, TailwindCSS, and comprehensive testing tools with an offline-first PWA architecture. The system leverages SvelteKit's static adapter for maximum deployment flexibility while providing professional-grade time tracking and billing management through intelligent external integrations with Asana API and cloud storage services.

The application follows a **component-driven architecture** with **reactive state management** using Svelte stores, clear separation between business logic services, UI components, and data persistence layers. This design ensures maintainability, testability, and future extensibility while delivering immediate value to freelancers and consultants.

## Architecture

### System Architecture Pattern

The application follows a **modern SvelteKit architecture** with **reactive state management** and **component-driven development**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SvelteKit Routes Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ /dashboard  │ │ /timer      │ │ /tasks      │ │  /reports   ││
│  │ +page.svelte│ │ +page.svelte│ │ +page.svelte│ │ +page.svelte││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Svelte Components Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │TimerWidget  │ │TimeEntryForm│ │ TaskCard    │ │ReportChart  ││
│  │   .svelte   │ │   .svelte   │ │  .svelte    │ │  .svelte    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Svelte Stores Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ timerStore  │ │ tasksStore  │ │ authStore   │ │ syncStore   ││
│  │    .ts      │ │    .ts      │ │    .ts      │ │    .ts      ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Business Logic Services                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │TimerService │ │BillingService│ │SyncService  │ │AsanaService ││
│  │    .ts      │ │    .ts      │ │    .ts      │ │    .ts      ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Data Persistence Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ IndexedDB   │ │ localStorage│ │ Encryption  │ │Cloud Storage││
│  │   Client    │ │   Manager   │ │  Service    │ │    API      ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### SvelteKit Directory Structure

```
src/
├── app.html                        # App shell template
├── app.css                         # Global styles with Tailwind
├── routes/                         # SvelteKit file-based routing
│   ├── +layout.svelte              # Root layout with navigation
│   ├── +layout.ts                  # Layout data loading
│   ├── +page.svelte                # Dashboard (/)
│   ├── timer/
│   │   ├── +page.svelte            # Timer page
│   │   └── +page.ts                # Timer page data
│   ├── tasks/
│   │   ├── +page.svelte            # Task management
│   │   ├── [id]/
│   │   │   └── +page.svelte        # Individual task view
│   │   └── new/
│   │       └── +page.svelte        # Create new task
│   ├── billing/
│   │   ├── +page.svelte            # Billing dashboard
│   │   ├── invoices/
│   │   │   ├── +page.svelte        # Invoice list
│   │   │   └── [id]/
│   │   │       └── +page.svelte    # Invoice details
│   │   └── rates/
│   │       └── +page.svelte        # Billing rates setup
│   ├── reports/
│   │   ├── +page.svelte            # Reports dashboard
│   │   ├── weekly/
│   │   │   └── +page.svelte        # Weekly reports
│   │   └── export/
│   │       └── +page.svelte        # Data export
│   └── settings/
│       ├── +page.svelte            # Settings dashboard
│       ├── asana/
│       │   └── +page.svelte        # Asana integration
│       └── profile/
│           └── +page.svelte        # User profile
├── lib/
│   ├── components/                 # Svelte components
│   │   ├── ui/                     # Base UI components
│   │   │   ├── Button.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── Table.svelte
│   │   │   └── Card.svelte
│   │   ├── timer/                  # Timer-specific components
│   │   │   ├── TimerWidget.svelte
│   │   │   ├── TimerControls.svelte
│   │   │   └── TimerDisplay.svelte
│   │   ├── forms/                  # Form components
│   │   │   ├── TimeEntryForm.svelte
│   │   │   ├── ProjectForm.svelte
│   │   │   ├── TaskForm.svelte
│   │   │   └── BillingForm.svelte
│   │   ├── charts/                 # Data visualization
│   │   │   ├── TimeChart.svelte
│   │   │   ├── RevenueChart.svelte
│   │   │   └── ProductivityChart.svelte
│   │   └── layout/                 # Layout components
│   │       ├── Navigation.svelte
│   │       ├── Sidebar.svelte
│   │       └── Header.svelte
│   ├── stores/                     # Svelte stores (state management)
│   │   ├── timer.ts                # Timer state
│   │   ├── tasks.ts                # Tasks state
│   │   ├── projects.ts             # Projects state
│   │   ├── timeEntries.ts          # Time entries state
│   │   ├── billing.ts              # Billing state
│   │   ├── auth.ts                 # Authentication state
│   │   ├── sync.ts                 # Sync state
│   │   └── settings.ts             # App settings
│   ├── services/                   # Business logic (preserved from old)
│   │   ├── timer-service.ts        # Core timer functionality
│   │   ├── time-entry-service.ts   # Time entry management
│   │   ├── billing-service.ts      # Billing calculations
│   │   ├── sync-service.ts         # Data synchronization
│   │   ├── asana-service.ts        # Asana API integration
│   │   ├── storage-service.ts      # Data persistence
│   │   └── encryption-service.ts   # Client-side encryption
│   ├── utils/                      # Shared utilities
│   │   ├── date-utils.ts           # Date/time utilities
│   │   ├── validation-utils.ts     # Input validation
│   │   ├── export-utils.ts         # Data export functionality
│   │   ├── format-utils.ts         # Data formatting
│   │   └── constants.ts            # App constants
│   └── types/                      # TypeScript definitions
│       ├── timer.ts                # Timer types
│       ├── tasks.ts                # Task types
│       ├── billing.ts              # Billing types
│       ├── auth.ts                 # Auth types
│       └── api.ts                  # API response types
├── stories/                        # Storybook stories
│   ├── Button.stories.ts
│   ├── TimerWidget.stories.ts
│   ├── TimeEntryForm.stories.ts
│   └── Modal.stories.ts
└── static/                         # Static assets
    ├── manifest.json               # PWA manifest
    ├── sw.js                       # Service worker
    └── icons/                      # App icons
```

## Components and Interfaces

### Reactive State Management with Svelte Stores

**timer.ts (Store)**

```typescript
import { writable, derived } from 'svelte/store';
import { TimerService } from '../services/timer-service';

interface TimerState {
	isRunning: boolean;
	startTime: Date | null;
	elapsed: number;
	currentTask: string | null;
	currentProject: string | null;
}

export const timerState = writable<TimerState>({
	isRunning: false,
	startTime: null,
	elapsed: 0,
	currentTask: null,
	currentProject: null
});

// Derived store for formatted time display
export const formattedTime = derived(timerState, ($timer) => {
	const hours = Math.floor($timer.elapsed / 3600);
	const minutes = Math.floor(($timer.elapsed % 3600) / 60);
	const seconds = $timer.elapsed % 60;
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Timer actions
export const timerActions = {
	start: (projectId: string, taskId?: string) => {
		TimerService.startTimer(projectId, taskId);
		timerState.update((state) => ({
			...state,
			isRunning: true,
			startTime: new Date(),
			currentProject: projectId,
			currentTask: taskId || null
		}));
	},

	stop: () => {
		TimerService.stopTimer();
		timerState.update((state) => ({
			...state,
			isRunning: false,
			startTime: null,
			elapsed: 0,
			currentProject: null,
			currentTask: null
		}));
	}
};
```

### Svelte Components

**TimerWidget.svelte**

```svelte
<script lang="ts">
	import { timerState, formattedTime, timerActions } from '$lib/stores/timer';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	export let projectId: string;
	export let taskId: string | undefined = undefined;

	$: isRunning = $timerState.isRunning;
	$: displayTime = $formattedTime;

	function handleStart() {
		timerActions.start(projectId, taskId);
	}

	function handleStop() {
		timerActions.stop();
	}
</script>

<Card class="timer-widget p-6">
	<div class="flex flex-col items-center space-y-4">
		<div class="font-mono text-4xl font-bold text-gray-900 dark:text-white">
			{displayTime}
		</div>

		<div class="flex space-x-3">
			{#if isRunning}
				<Button variant="danger" size="lg" on:click={handleStop} class="px-8">Stop Timer</Button>
			{:else}
				<Button variant="primary" size="lg" on:click={handleStart} class="px-8">Start Timer</Button>
			{/if}
		</div>

		{#if $timerState.currentProject}
			<div class="text-sm text-gray-600 dark:text-gray-400">
				Project: {$timerState.currentProject}
				{#if $timerState.currentTask}
					• Task: {$timerState.currentTask}
				{/if}
			</div>
		{/if}
	</div>
</Card>

<style>
	.timer-widget {
		@apply rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800;
	}
</style>
```

### Business Logic Services (Enhanced)

**timer-service.ts (Enhanced with Svelte Store Integration)**

```typescript
import { get } from 'svelte/store';
import { timerState } from '../stores/timer';
import { timeEntries } from '../stores/timeEntries';
import { StorageService } from './storage-service';

export class TimerService {
	private static intervalId: number | null = null;

	static startTimer(projectId: string, taskId?: string): void {
		const startTime = new Date();

		// Update store
		timerState.update((state) => ({
			...state,
			isRunning: true,
			startTime,
			currentProject: projectId,
			currentTask: taskId || null,
			elapsed: 0
		}));

		// Start interval for elapsed time updates
		this.intervalId = window.setInterval(() => {
			const current = get(timerState);
			if (current.startTime) {
				const elapsed = Math.floor((Date.now() - current.startTime.getTime()) / 1000);
				timerState.update((state) => ({ ...state, elapsed }));
			}
		}, 1000);

		// Persist timer state
		StorageService.saveTimerSession({
			startTime,
			projectId,
			taskId,
			isActive: true
		});
	}

	static stopTimer(): void {
		const currentState = get(timerState);

		if (currentState.isRunning && currentState.startTime) {
			const endTime = new Date();
			const duration = (endTime.getTime() - currentState.startTime.getTime()) / 1000 / 3600; // hours

			// Create time entry
			const timeEntry = {
				id: crypto.randomUUID(),
				projectId: currentState.currentProject!,
				taskId: currentState.currentTask,
				date: currentState.startTime.toISOString().split('T')[0],
				startTime: currentState.startTime.toISOString(),
				endTime: endTime.toISOString(),
				duration,
				description: '', // Can be filled later
				billableHours: duration, // Default to same as duration
				createdAt: new Date().toISOString()
			};

			// Add to time entries store
			timeEntries.update((entries) => [...entries, timeEntry]);

			// Clear timer state
			timerState.set({
				isRunning: false,
				startTime: null,
				elapsed: 0,
				currentProject: null,
				currentTask: null
			});

			// Clear interval
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}

			// Persist changes
			StorageService.clearTimerSession();
			StorageService.saveTimeEntry(timeEntry);
		}
	}

	static pauseTimer(): void {
		// Implementation for pause functionality
	}

	static resumeTimer(): void {
		// Implementation for resume functionality
	}
}
```

## Data Models (Enhanced with TypeScript)

### Core Entity Models

**Project Model:**

```typescript
interface Project {
	id: string;
	name: string;
	clientName: string;
	description?: string;
	defaultBillingRate: number;
	colorCode: string;
	status: 'active' | 'archived' | 'completed';
	estimatedHours?: number;
	actualHours: number; // calculated from time entries
	createdAt: string;
	updatedAt: string;
}
```

**Task Model:**

```typescript
interface Task {
	id: string;
	projectId: string;
	title: string;
	description?: string;
	estimatedHours?: number;
	actualHours: number; // calculated from time entries
	priority: 'low' | 'medium' | 'high' | 'urgent';
	status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
	asanaTaskId?: string; // for Asana integration
	tags: string[];
	createdAt: string;
	updatedAt: string;
	dueDate?: string;
}
```

**Time Entry Model:**

```typescript
interface TimeEntry {
	id: string;
	projectId: string;
	taskId?: string;
	date: string; // YYYY-MM-DD format
	startTime: string; // ISO string
	endTime: string; // ISO string
	duration: number; // hours as decimal
	description: string;
	category: 'development' | 'review' | 'meeting' | 'research' | 'fix' | 'other';
	trackedHours: number;
	billableHours: number; // can differ from tracked
	billingRate?: number; // override project rate
	billingStatus: 'ready' | 'billed' | 'paid';
	invoiceId?: string; // set when billed
	tags: string[];
	createdAt: string;
	updatedAt: string;
}
```

]);

export const errorActions = {
add: (error: Omit<AppError, 'id' | 'timestamp' | 'resolved'>) => {
const newError: AppError = {
...error,
id: crypto.randomUUID(),
timestamp: new Date(),
resolved: false
};

    errors.update(errs => [...errs, newError]);

    // Auto-remove non-critical errors after 5 seconds
    if (error.type !== 'storage' && error.type !== 'sync') {
      setTimeout(() => {
        errorActions.resolve(newError.id);
      }, 5000);
    }

},

resolve: (id: string) => {
errors.update(errs => errs.filter(err => err.id !== id));
},

resolveAll: () => {
errors.set([]);
}
};

````

**Error Boundary Component:**
```svelte
<!-- lib/components/ErrorBoundary.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { errors, errorActions } from '$lib/stores/error';
  import Button from '$lib/components/ui/Button.svelte';

  let hasError = false;
  let errorDetails: any = null;

  onMount(() => {
    const handleError = (event: ErrorEvent) => {
      hasError = true;
      errorDetails = event.error;

      errorActions.add({
        type: 'general',
        message: event.error?.message || 'An unexpected error occurred',
        details: event.error
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  });

  function handleRetry() {
    hasError = false;
    errorDetails = null;
    window.location.reload();
  }
</script>

{#if hasError}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">Something went wrong</h3>
          <p class="text-sm text-gray-500">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
        </div>
      </div>

      <div class="flex space-x-3">
        <Button variant="primary" on:click={handleRetry}>
          Retry
        </Button>
        <Button variant="secondary" on:click={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>

      {#if errorDetails && import.meta.env.DEV}
        <details class="mt-4">
          <summary class="text-sm text-gray-500 cursor-pointer">Error Details (Dev Mode)</summary>
          <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(errorDetails, null, 2)}</pre>
        </details>
      {/if}
    </div>
  </div>
{:else}
  <slot />
{/if}
````

### Specific Error Handling Patterns

**Network Error Handling:**

```typescript
// services/api-client.ts
export class ApiClient {
	private static async handleRequest<T>(
		request: () => Promise<T>,
		errorType: 'network' | 'sync' = 'network'
	): Promise<T> {
		try {
			return await request();
		} catch (error) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				errorActions.add({
					type: errorType,
					message: 'Network connection failed. Please check your internet connection.',
					details: error
				});
				throw new NetworkError('Connection failed');
			}

			if (error instanceof Response) {
				if (error.status === 429) {
					errorActions.add({
						type: errorType,
						message: 'Rate limit exceeded. Please wait a moment before trying again.',
						details: { status: error.status, statusText: error.statusText }
					});
					throw new RateLimitError('Rate limit exceeded');
				}

				if (error.status >= 500) {
					errorActions.add({
						type: errorType,
						message: 'Server error occurred. Please try again later.',
						details: { status: error.status, statusText: error.statusText }
					});
					throw new ServerError('Server error');
				}
			}

			throw error;
		}
	}
}
```

**Storage Error Handling:**

```typescript
// services/storage-service.ts
export class StorageService {
	static async saveData(key: string, data: any): Promise<void> {
		try {
			const serialized = JSON.stringify(data);

			// Check if we're approaching storage limits
			const usage = this.getStorageUsage();
			if (usage > 0.8) {
				errorActions.add({
					type: 'storage',
					message: 'Storage space is running low. Consider archiving old data.',
					details: { usage: Math.round(usage * 100) }
				});
			}

			localStorage.setItem(key, serialized);
		} catch (error) {
			if (error.name === 'QuotaExceededError') {
				errorActions.add({
					type: 'storage',
					message: 'Storage quota exceeded. Please free up space or archive old data.',
					details: error
				});

				// Attempt automatic cleanup
				await this.performAutomaticCleanup();
				throw new StorageQuotaError('Storage quota exceeded');
			}

			errorActions.add({
				type: 'storage',
				message: 'Failed to save data to local storage.',
				details: error
			});
			throw error;
		}
	}

	private static async performAutomaticCleanup(): Promise<void> {
		// Archive old time entries
		// Remove expired cache data
		// Compress stored data
	}
}
```

## Performance Optimization (SvelteKit Specific)

### Code Splitting and Lazy Loading

**Route-based Code Splitting:**

```typescript
// routes/reports/+page.ts
export const load = async ({ fetch }) => {
	// Lazy load chart library only when needed
	const { Chart } = await import('chart.js/auto');

	return {
		Chart
	};
};
```

**Component Lazy Loading:**

```svelte
<!-- Heavy components loaded on demand -->
<script lang="ts">
	import { onMount } from 'svelte';

	let ReportChart: any = null;
	let showChart = false;

	onMount(async () => {
		if (showChart) {
			const module = await import('$lib/components/charts/ReportChart.svelte');
			ReportChart = module.default;
		}
	});
</script>

{#if showChart && ReportChart}
	<svelte:component this={ReportChart} {data} />
{:else}
	<div class="chart-placeholder">
		<button on:click={() => (showChart = true)}>Load Chart</button>
	</div>
{/if}
```

### State Management Optimization

**Derived Stores for Computed Values:**

```typescript
// stores/computed.ts
import { derived } from 'svelte/store';
import { timeEntries } from './timeEntries';
import { projects } from './projects';

// Expensive calculations cached automatically
export const projectSummaries = derived([timeEntries, projects], ([$timeEntries, $projects]) => {
	return $projects.map((project) => {
		const entries = $timeEntries.filter((entry) => entry.projectId === project.id);
		const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0);
		const totalBillable = entries.reduce(
			(sum, entry) => sum + entry.billableHours * (entry.billingRate || project.defaultBillingRate),
			0
		);

		return {
			...project,
			totalHours,
			totalBillable,
			entryCount: entries.length
		};
	});
});

// Memoized expensive filters
export const filteredTasks = derived([tasks, taskFilters], ([$tasks, $filters]) => {
	// Filtering logic with memoization
	return $tasks.filter((task) => {
		if ($filters.status.length && !$filters.status.includes(task.status)) return false;
		if ($filters.priority.length && !$filters.priority.includes(task.priority)) return false;
		if ($filters.project.length && !$filters.project.includes(task.projectId)) return false;
		return true;
	});
});
```

### Bundle Optimization

**vite.config.ts optimization:**

```typescript
import { defineConfig } from 'vite';
import { svelte } from '@svelte/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Vendor chunks
					'vendor-ui': ['chart.js', 'd3'],
					'vendor-utils': ['date-fns', 'uuid'],

					// Feature chunks
					timer: ['$lib/components/timer', '$lib/stores/timer'],
					billing: ['$lib/components/billing', '$lib/stores/billing'],
					reports: ['$lib/components/charts', '$lib/stores/reports']
				}
			}
		},
		target: 'es2020',
		minify: 'esbuild',
		sourcemap: true
	},
	optimizeDeps: {
		include: ['chart.js', 'date-fns']
	}
});
```

## PWA Implementation (Enhanced)

### Service Worker Strategy

**sw.js (Enhanced for SvelteKit):**

```javascript
import { build, files, version } from '$service-worker';

const CACHE_NAME = `timeflow-pro-${version}`;
const STATIC_CACHE = `static-${version}`;
const RUNTIME_CACHE = `runtime-${version}`;

// Files to cache on install
const STATIC_ASSETS = [
	...build, // SvelteKit build files
	...files, // Static files
	'/', // Root route
	'/timer',
	'/tasks',
	'/offline' // Offline fallback page
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
			caches.open(RUNTIME_CACHE)
		]).then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => !key.includes(version)).map((key) => caches.delete(key)))
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	// Skip non-GET requests
	if (request.method !== 'GET') return;

	// API requests - network first with fallback
	if (request.url.includes('/api/')) {
		event.respondWith(networkFirstStrategy(request));
		return;
	}

	// Static assets - cache first
	if (STATIC_ASSETS.some((asset) => request.url.includes(asset))) {
		event.respondWith(cacheFirstStrategy(request));
		return;
	}

	// Other requests - stale while revalidate
	event.respondWith(staleWhileRevalidateStrategy(request));
});

async function networkFirstStrategy(request) {
	try {
		const response = await fetch(request);
		const cache = await caches.open(RUNTIME_CACHE);
		cache.put(request, response.clone());
		return response;
	} catch {
		const cached = await caches.match(request);
		return cached || new Response('Offline', { status: 503 });
	}
}

async function cacheFirstStrategy(request) {
	const cached = await caches.match(request);
	return cached || fetch(request);
}

async function staleWhileRevalidateStrategy(request) {
	const cache = await caches.open(RUNTIME_CACHE);
	const cached = await cache.match(request);

	const fetchPromise = fetch(request).then((response) => {
		cache.put(request, response.clone());
		return response;
	});

	return cached || fetchPromise;
}
```

### Offline Functionality

**Offline Detection:**

```typescript
// stores/network.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const isOnline = writable(browser ? navigator.onLine : true);
export const wasOffline = writable(false);

if (browser) {
	const updateOnlineStatus = () => {
		const online = navigator.onLine;
		isOnline.set(online);

		if (!online) {
			wasOffline.set(true);
		}
	};

	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
}
```

**Offline Queue:**

```typescript
// services/offline-queue.ts
import { writable } from 'svelte/store';
import { isOnline } from '$lib/stores/network';

interface QueuedAction {
	id: string;
	type: 'sync' | 'api' | 'upload';
	payload: any;
	timestamp: Date;
	retries: number;
}

export const offlineQueue = writable<QueuedAction[]>([]);

export const queueActions = {
	add: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
		const queuedAction: QueuedAction = {
			...action,
			id: crypto.randomUUID(),
			timestamp: new Date(),
			retries: 0
		};

		offlineQueue.update((queue) => [...queue, queuedAction]);
	},

	process: async () => {
		const queue = get(offlineQueue);
		const online = get(isOnline);

		if (!online || queue.length === 0) return;

		for (const action of queue) {
			try {
				await processAction(action);
				queueActions.remove(action.id);
			} catch (error) {
				if (action.retries < 3) {
					queueActions.retry(action.id);
				} else {
					queueActions.remove(action.id);
					console.error('Failed to process queued action:', action, error);
				}
			}
		}
	},

	remove: (id: string) => {
		offlineQueue.update((queue) => queue.filter((action) => action.id !== id));
	},

	retry: (id: string) => {
		offlineQueue.update((queue) =>
			queue.map((action) =>
				action.id === id ? { ...action, retries: action.retries + 1 } : action
			)
		);
	}
};

// Auto-process queue when coming back online
isOnline.subscribe((online) => {
	if (online) {
		queueActions.process();
	}
});
```

This comprehensive design document now fully reflects the modern SvelteKit architecture while preserving all the excellent business logic and concepts from the original. The document covers:

1. **Updated Architecture** - SvelteKit routes, components, stores
2. **Component-Driven Development** - With Storybook integration
3. **Modern State Management** - Svelte stores with TypeScript
4. **Comprehensive Testing** - Vitest, Playwright, visual regression
5. **Enhanced Error Handling** - Global error boundaries and specific patterns
6. **Performance Optimization** - Code splitting, lazy loading, caching
7. **PWA Implementation** - Advanced service worker and offline support

The design maintains the offline-first philosophy while leveraging modern development practices and tools. Ready for implementation! 🚀

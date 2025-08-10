# Building TimeFlow Pro - Task 1.3: Real-Time Timer Engine with Svelte Stores

## Context

I'm implementing the core timer functionality for TimeFlow Pro. This is the heart of the application - a precise, reliable timer that persists across browser sessions and provides real-time updates.

## Reference Files

[Attach: tasks.md, design.md, technical-assumptions.md, requirements.md]

## Specific Task (from tasks.md)

Story 1.3: Real-Time Timer Engine with Svelte Stores

- Create timerStore.ts with reactive state management
- Implement start, stop, pause, resume with persistence
- Build timer components with real-time display
- Ensure accuracy over 24+ hour sessions

## What I Need You to Create:

### 1. Timer Store (`src/lib/stores/timer.ts`):

```typescript
interface TimerState {
	isRunning: boolean;
	startTime: Date | null;
	elapsed: number; // seconds
	currentProject: string | null;
	currentTask: string | null;
	isPaused: boolean;
	pausedDuration: number;
}
```

### 2. Timer Service (`src/lib/services/timer-service.ts`):

- Start/stop/pause/resume functionality
- localStorage persistence with IndexedDB backup
- Accuracy validation and drift compensation
- Session recovery after browser crashes

### 3. Timer Components:

- `src/lib/components/timer/TimerWidget.svelte` - Main timer interface
- `src/lib/components/timer/TimerDisplay.svelte` - Formatted time display (HH:MM:SS)
- `src/lib/components/timer/TimerControls.svelte` - Start/stop/pause buttons

### 4. Utility Functions (`src/lib/utils/time-utils.ts`):

- Time formatting functions
- Duration calculations
- Accuracy validation helpers

### 5. TypeScript Interfaces (`src/lib/types/timer.ts`):

- TimerState interface
- TimerSession interface
- Timer action types

### 6. Comprehensive Tests:

- Timer accuracy tests over extended periods
- Persistence tests across browser refreshes
- Store reactivity tests
- Component interaction tests

## Requirements:

- Maintain ±1 second accuracy over 24+ hour sessions
- Persist timer state in localStorage with automatic IndexedDB backup
- Handle browser crashes gracefully with session recovery
- Real-time updates every second without performance impact
- Keyboard shortcuts (Space to start/stop, P to pause)
- Visual feedback for all timer state changes
- Accessibility support for screen readers

## Expected Output:

1. Complete timer store with reactive state management
2. Timer service with persistence and accuracy guarantees
3. Three timer components with consistent styling
4. Utility functions for time formatting and calculations
5. Comprehensive test suite covering edge cases
6. Integration with existing UI components (Button, Card)

## Success Criteria:

- Timer runs accurately for 24+ hours without drift
- State persists across browser crashes and refreshes
- Real-time updates perform smoothly without lag
- All tests pass including accuracy validation
- Components work with keyboard navigation
- Timer integrates seamlessly with project/task selection

## Usage Example Expected:

```svelte
<script lang="ts">
	import { TimerWidget } from '$lib/components/timer';
	import { timerState } from '$lib/stores/timer';
</script>

<TimerWidget
	projectId="project-123"
	taskId="task-456"
	on:started={() => console.log('Timer started')}
	on:stopped={(event) => console.log('Time entry created:', event.detail)}
/>

<p>Current elapsed time: {$timerState.elapsed} seconds</p>
```

## Technical Specifications:

- Use `setInterval` with 1000ms precision
- Implement drift compensation using `performance.now()`
- Store timer state every 5 seconds for crash recovery
- Use Svelte derived stores for formatted time display
- Implement proper cleanup on component destroy

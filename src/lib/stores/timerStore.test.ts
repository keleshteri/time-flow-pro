/**
 * Timer Store Tests
 * 
 * Comprehensive tests for the timer store functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { timerStore, isRunning, isPaused, isStopped, currentElapsed } from './timerStore';

// Mock the event bus
vi.mock('../utils/eventBus', () => ({
	eventBus: {
		emit: vi.fn()
	}
}));

describe('Timer Store', () => {
	beforeEach(() => {
		// Reset timer store to initial state
		timerStore.reset();
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		timerStore.cleanup();
		vi.useRealTimers();
	});

	describe('Initial State', () => {
		it('should have correct initial state', () => {
			const state = timerStore.getCurrentState();
			
			expect(state.status).toBe('stopped');
			expect(state.startTime).toBe(null);
			expect(state.endTime).toBe(null);
			expect(state.pausedTime).toBe(null);
			expect(state.elapsedTime).toBe(0);
			expect(state.totalElapsed).toBe(0);
			expect(state.projectId).toBe(null);
			expect(state.taskId).toBe(null);
			expect(state.description).toBe('');
		});

		it('should have correct derived store values', () => {
			expect(get(isRunning)).toBe(false);
			expect(get(isPaused)).toBe(false);
			expect(get(isStopped)).toBe(true);
			expect(get(currentElapsed)).toBe(0);
		});
	});

	describe('Starting Timer', () => {
		it('should start timer with default options', () => {
			timerStore.start();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('running');
			expect(state.startTime).toBeInstanceOf(Date);
			expect(state.elapsedTime).toBe(0);
			expect(get(isRunning)).toBe(true);
		});

		it('should start timer with project and task', () => {
			timerStore.start({
				projectId: 'project-123',
				taskId: 'task-456',
				description: 'Working on feature'
			});
			
			const state = timerStore.getCurrentState();
			expect(state.projectId).toBe('project-123');
			expect(state.taskId).toBe('task-456');
			expect(state.description).toBe('Working on feature');
		});

		it('should update elapsed time automatically', () => {
			timerStore.start();
			
			// Fast-forward 5 seconds
			vi.advanceTimersByTime(5000);
			
			const state = timerStore.getCurrentState();
			expect(state.elapsedTime).toBe(5);
		});

		it('should stop existing timer when starting new one', () => {
			timerStore.start({ projectId: 'project-1' });
			const firstState = timerStore.getCurrentState();
			
			timerStore.start({ projectId: 'project-2' });
			const secondState = timerStore.getCurrentState();
			
			expect(firstState.intervalId).toBeDefined();
			expect(secondState.projectId).toBe('project-2');
		});
	});

	describe('Stopping Timer', () => {
		it('should stop running timer', () => {
			timerStore.start();
			vi.advanceTimersByTime(3000);
			
			timerStore.stop();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('stopped');
			expect(state.endTime).toBeInstanceOf(Date);
			expect(state.elapsedTime).toBe(3);
			expect(state.totalElapsed).toBe(3);
			expect(get(isStopped)).toBe(true);
		});

		it('should clear interval when stopping', () => {
			timerStore.start();
			const runningState = timerStore.getCurrentState();
			expect(runningState.intervalId).toBeDefined();
			
			timerStore.stop();
			const stoppedState = timerStore.getCurrentState();
			expect(stoppedState.intervalId).toBeUndefined();
		});
	});

	describe('Pausing and Resuming Timer', () => {
		it('should pause running timer', () => {
			timerStore.start();
			vi.advanceTimersByTime(2000);
			
			timerStore.pause();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('paused');
			expect(state.pausedTime).toBeInstanceOf(Date);
			expect(state.elapsedTime).toBe(2);
			expect(get(isPaused)).toBe(true);
		});

		it('should resume paused timer', () => {
			timerStore.start();
			vi.advanceTimersByTime(2000);
			timerStore.pause();
			
			// Advance time while paused
			vi.advanceTimersByTime(1000);
			
			timerStore.resume();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('running');
			expect(state.pausedTime).toBe(null);
			expect(get(isRunning)).toBe(true);
		});

		it('should not pause if not running', () => {
			timerStore.pause();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('stopped');
		});

		it('should not resume if not paused', () => {
			timerStore.resume();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('stopped');
		});
	});

	describe('Resetting Timer', () => {
		it('should reset timer to initial state', () => {
			timerStore.start({ projectId: 'test' });
			vi.advanceTimersByTime(5000);
			timerStore.stop();
			
			timerStore.reset();
			
			const state = timerStore.getCurrentState();
			expect(state.status).toBe('stopped');
			expect(state.startTime).toBe(null);
			expect(state.elapsedTime).toBe(0);
			expect(state.totalElapsed).toBe(0);
			expect(state.projectId).toBe(null);
		});

		it('should clear interval when resetting', () => {
			timerStore.start();
			timerStore.reset();
			
			const state = timerStore.getCurrentState();
			expect(state.intervalId).toBeUndefined();
		});
	});

	describe('Context Updates', () => {
		it('should update timer context', () => {
			timerStore.start();
			
			timerStore.updateContext('new-project', 'new-task', 'new description');
			
			const state = timerStore.getCurrentState();
			expect(state.projectId).toBe('new-project');
			expect(state.taskId).toBe('new-task');
			expect(state.description).toBe('new description');
		});

		it('should preserve existing values when updating partially', () => {
			timerStore.start({
				projectId: 'original-project',
				taskId: 'original-task',
				description: 'original description'
			});
			
			timerStore.updateContext('new-project');
			
			const state = timerStore.getCurrentState();
			expect(state.projectId).toBe('new-project');
			expect(state.taskId).toBe('original-task');
			expect(state.description).toBe('original description');
		});
	});

	describe('Derived Stores', () => {
		it('should update derived stores correctly', () => {
			// Initial state
			expect(get(isRunning)).toBe(false);
			expect(get(isPaused)).toBe(false);
			expect(get(isStopped)).toBe(true);
			
			// Start timer
			timerStore.start();
			expect(get(isRunning)).toBe(true);
			expect(get(isPaused)).toBe(false);
			expect(get(isStopped)).toBe(false);
			
			// Pause timer
			timerStore.pause();
			expect(get(isRunning)).toBe(false);
			expect(get(isPaused)).toBe(true);
			expect(get(isStopped)).toBe(false);
			
			// Stop timer
			timerStore.stop();
			expect(get(isRunning)).toBe(false);
			expect(get(isPaused)).toBe(false);
			expect(get(isStopped)).toBe(true);
		});

		it('should update elapsed time in derived store', () => {
			timerStore.start();
			
			expect(get(currentElapsed)).toBe(0);
			
			vi.advanceTimersByTime(3000);
			expect(get(currentElapsed)).toBe(3);
		});
	});

	describe('Cleanup', () => {
		it('should cleanup intervals on cleanup call', () => {
			timerStore.start();
			const state = timerStore.getCurrentState();
			expect(state.intervalId).toBeDefined();
			
			timerStore.cleanup();
			
			// Interval should be cleared (we can't directly test this,
			// but we can verify the timer doesn't continue updating)
			const initialElapsed = timerStore.getCurrentState().elapsedTime;
			vi.advanceTimersByTime(2000);
			const finalElapsed = timerStore.getCurrentState().elapsedTime;
			
			// If cleanup worked, elapsed time shouldn't have changed
			expect(finalElapsed).toBe(initialElapsed);
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid start/stop cycles', () => {
			for (let i = 0; i < 5; i++) {
				timerStore.start();
				vi.advanceTimersByTime(1000); // Use longer time to ensure accumulation
				timerStore.stop();
			}

			const state = timerStore.getCurrentState();
			expect(state.status).toBe('stopped');
			expect(state.totalElapsed).toBeGreaterThanOrEqual(5); // Should have at least 5 seconds total
		});

		it('should handle pause/resume cycles', () => {
			timerStore.start();
			vi.advanceTimersByTime(1000);
			
			timerStore.pause();
			vi.advanceTimersByTime(500); // Time while paused
			
			timerStore.resume();
			vi.advanceTimersByTime(1000);
			
			const state = timerStore.getCurrentState();
			expect(state.elapsedTime).toBe(2); // Should not include paused time
		});
	});
});

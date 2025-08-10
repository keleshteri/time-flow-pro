/**
 * Test Helpers for TimeFlow Pro
 *
 * Utility functions and mock data for testing
 */

import type { Project, Task, TimeEntry, TimerState } from '$lib/types';

/**
 * Create a mock project for testing
 */
export function createMockProject(overrides: Partial<Project> = {}): Project {
	const now = new Date().toISOString();

	return {
		id: 'project-1',
		name: 'Test Project',
		clientName: 'Test Client',
		description: 'A test project for development',
		defaultBillingRate: 75,
		colorCode: '#3b82f6',
		status: 'active',
		estimatedHours: 40,
		actualHours: 0,
		budget: 3000,
		currency: 'USD',
		tags: ['development', 'testing'],
		isBillable: true,
		isArchived: false,
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

/**
 * Create a mock task for testing
 */
export function createMockTask(overrides: Partial<Task> = {}): Task {
	const now = new Date().toISOString();

	return {
		id: 'task-1',
		projectId: 'project-1',
		title: 'Test Task',
		description: 'A test task for development',
		estimatedHours: 8,
		actualHours: 0,
		priority: 'medium',
		status: 'pending',
		tags: ['feature', 'frontend'],
		completionPercentage: 0,
		isBillable: true,
		dependencies: [],
		subtasks: [],
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

/**
 * Create a mock time entry for testing
 */
export function createMockTimeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
	const now = new Date();
	const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

	return {
		id: 'entry-1',
		projectId: 'project-1',
		taskId: 'task-1',
		date: now.toISOString().split('T')[0] ?? '',
		startTime: startTime.toISOString(),
		endTime: now.toISOString(),
		duration: 2,
		description: 'Test time entry',
		category: 'development',
		trackedHours: 2,
		billableHours: 2,
		billingStatus: 'ready',
		tags: ['testing'],
		fromTimer: true,
		isEdited: false,
		createdAt: now.toISOString(),
		updatedAt: now.toISOString(),
		...overrides
	};
}

/**
 * Create a mock timer state for testing
 */
export function createMockTimerState(overrides: Partial<TimerState> = {}): TimerState {
	return {
		isRunning: false,
		startTime: null,
		elapsed: 0,
		currentProject: null,
		currentTask: null,
		description: '',
		...overrides
	};
}

/**
 * Wait for a specified amount of time (for async tests)
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format duration for display (HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate duration between two dates in hours
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
	return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Generate a random UUID for testing
 */
export function generateTestId(): string {
	return `test-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * TypeScript Interface Tests
 *
 * Tests to verify TypeScript interfaces work correctly
 */

import { describe, it, expect } from 'vitest';
import {
	createMockProject,
	createMockTask,
	createMockTimeEntry,
	createMockTimerState
} from '$lib/utils/test-helpers';

describe('TypeScript Interfaces', () => {
	describe('Project Interface', () => {
		it('should create a valid project object', () => {
			const project = createMockProject();

			expect(project).toHaveProperty('id');
			expect(project).toHaveProperty('name');
			expect(project).toHaveProperty('clientName');
			expect(project).toHaveProperty('defaultBillingRate');
			expect(project.status).toBe('active');
			expect(project.isBillable).toBe(true);
			expect(project.isArchived).toBe(false);
		});

		it('should allow overriding project properties', () => {
			const project = createMockProject({
				name: 'Custom Project',
				status: 'completed',
				defaultBillingRate: 100
			});

			expect(project.name).toBe('Custom Project');
			expect(project.status).toBe('completed');
			expect(project.defaultBillingRate).toBe(100);
		});
	});

	describe('Task Interface', () => {
		it('should create a valid task object', () => {
			const task = createMockTask();

			expect(task).toHaveProperty('id');
			expect(task).toHaveProperty('projectId');
			expect(task).toHaveProperty('title');
			expect(task.priority).toBe('medium');
			expect(task.status).toBe('pending');
			expect(task.completionPercentage).toBe(0);
		});

		it('should allow overriding task properties', () => {
			const task = createMockTask({
				title: 'Custom Task',
				priority: 'high',
				status: 'in-progress',
				completionPercentage: 50
			});

			expect(task.title).toBe('Custom Task');
			expect(task.priority).toBe('high');
			expect(task.status).toBe('in-progress');
			expect(task.completionPercentage).toBe(50);
		});
	});

	describe('TimeEntry Interface', () => {
		it('should create a valid time entry object', () => {
			const entry = createMockTimeEntry();

			expect(entry).toHaveProperty('id');
			expect(entry).toHaveProperty('projectId');
			expect(entry).toHaveProperty('startTime');
			expect(entry).toHaveProperty('endTime');
			expect(entry.duration).toBe(2);
			expect(entry.category).toBe('development');
			expect(entry.billingStatus).toBe('ready');
		});

		it('should allow overriding time entry properties', () => {
			const entry = createMockTimeEntry({
				duration: 4,
				category: 'meeting',
				billingStatus: 'billed',
				description: 'Custom description'
			});

			expect(entry.duration).toBe(4);
			expect(entry.category).toBe('meeting');
			expect(entry.billingStatus).toBe('billed');
			expect(entry.description).toBe('Custom description');
		});
	});

	describe('TimerState Interface', () => {
		it('should create a valid timer state object', () => {
			const timerState = createMockTimerState();

			expect(timerState.isRunning).toBe(false);
			expect(timerState.startTime).toBeNull();
			expect(timerState.elapsed).toBe(0);
			expect(timerState.currentProject).toBeNull();
			expect(timerState.currentTask).toBeNull();
		});

		it('should allow overriding timer state properties', () => {
			const timerState = createMockTimerState({
				isRunning: true,
				startTime: new Date(),
				elapsed: 3600,
				currentProject: 'project-1',
				currentTask: 'task-1'
			});

			expect(timerState.isRunning).toBe(true);
			expect(timerState.startTime).toBeInstanceOf(Date);
			expect(timerState.elapsed).toBe(3600);
			expect(timerState.currentProject).toBe('project-1');
			expect(timerState.currentTask).toBe('task-1');
		});
	});
});

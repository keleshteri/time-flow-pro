/**
 * Progress Utilities Tests for TimeFlow Pro
 * 
 * Comprehensive tests for progress calculation utilities including
 * project progress, task progress, status determination, and UI helpers.
 */

import { describe, it, expect } from 'vitest';
import type { Project, Task, TimeEntry, ProjectSummary, TaskSummary } from '$lib/types/index.js';
import {
	calculateTotalHours,
	calculateBillableHours,
	calculateBillableAmount,
	calculateProjectProgress,
	calculateTaskProgress,
	isTaskOverdue,
	getDaysUntilDue,
	isTaskOnTrack,
	generateProjectSummary,
	generateTaskSummary,
	getPriorityColorClass,
	getStatusColorClass,
	getProgressColorClass,
	formatProgress,
	estimateCompletionDate
} from './progress-utils.js';

// Mock data
const mockProject: Project = {
	id: 'project-1',
	name: 'Test Project',
	clientName: 'Test Client',
	defaultBillingRate: 100,
	colorCode: '#3B82F6',
	status: 'active',
	estimatedHours: 40,
	actualHours: 0,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
	budget: 4000,
	currency: 'USD',
	tags: [],
	isBillable: true,
	isArchived: false
};

const mockTask: Task = {
	id: 'task-1',
	projectId: 'project-1',
	title: 'Test Task',
	estimatedHours: 8,
	actualHours: 0,
	priority: 'medium',
	status: 'pending',
	tags: [],
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
	completionPercentage: 0,
	isBillable: true
};

const mockTimeEntries: TimeEntry[] = [
	{
		id: 'entry-1',
		projectId: 'project-1',
		taskId: 'task-1',
		description: 'Test work',
		duration: 2, // 2 hours
		billableHours: 2,
		billingRate: 100,
		date: '2024-01-01',
		startTime: '09:00',
		endTime: '11:00',
		createdAt: '2024-01-01T09:00:00Z',
		updatedAt: '2024-01-01T11:00:00Z',
		isBillable: true
	},
	{
		id: 'entry-2',
		projectId: 'project-1',
		taskId: 'task-1',
		description: 'More test work',
		duration: 3, // 3 hours
		billableHours: 2.5,
		billingRate: 100,
		date: '2024-01-02',
		startTime: '09:00',
		endTime: '12:00',
		createdAt: '2024-01-02T09:00:00Z',
		updatedAt: '2024-01-02T12:00:00Z',
		isBillable: true
	}
];

describe('Progress Utilities', () => {
	describe('Basic Calculations', () => {
		it('should calculate total hours correctly', () => {
			expect(calculateTotalHours(mockTimeEntries)).toBe(5);
			expect(calculateTotalHours([])).toBe(0);
		});

		it('should calculate billable hours correctly', () => {
			expect(calculateBillableHours(mockTimeEntries)).toBe(4.5);
			expect(calculateBillableHours([])).toBe(0);
		});

		it('should calculate billable amount correctly', () => {
			expect(calculateBillableAmount(mockTimeEntries, 100)).toBe(450);
			expect(calculateBillableAmount([], 100)).toBe(0);
		});
	});

	describe('Project Progress', () => {
		it('should calculate project progress based on tasks', () => {
			const tasks: Task[] = [
				{ ...mockTask, id: 'task-1', status: 'completed' },
				{ ...mockTask, id: 'task-2', status: 'pending' },
				{ ...mockTask, id: 'task-3', status: 'completed' }
			];
			
			const progress = calculateProjectProgress(mockProject, tasks, []);
			expect(progress).toBe(66.66666666666666); // 2 out of 3 tasks completed
		});

		it('should calculate project progress based on time when no tasks', () => {
			const projectWithEstimate = { ...mockProject, estimatedHours: 10 };
			const timeEntries = [{ ...mockTimeEntries[0], duration: 5 }];
			
			const progress = calculateProjectProgress(projectWithEstimate, [], timeEntries);
			expect(progress).toBe(50); // 5 hours out of 10 estimated
		});

		it('should return 0 progress when no tasks or estimates', () => {
			const projectWithoutEstimate = { ...mockProject, estimatedHours: undefined };
			const progress = calculateProjectProgress(projectWithoutEstimate, [], []);
			expect(progress).toBe(0);
		});
	});

	describe('Task Progress', () => {
		it('should return 100% for completed tasks', () => {
			const completedTask = { ...mockTask, status: 'completed' as const };
			const progress = calculateTaskProgress(completedTask, []);
			expect(progress).toBe(100);
		});

		it('should return 0% for cancelled tasks', () => {
			const cancelledTask = { ...mockTask, status: 'cancelled' as const };
			const progress = calculateTaskProgress(cancelledTask, []);
			expect(progress).toBe(0);
		});

		it('should calculate progress based on estimated hours', () => {
			const taskWithEstimate = { ...mockTask, estimatedHours: 10 };
			const timeEntries = [{ ...mockTimeEntries[0], duration: 5 }];
			
			const progress = calculateTaskProgress(taskWithEstimate, timeEntries);
			expect(progress).toBe(50); // 5 hours out of 10 estimated
		});

		it('should use completion percentage when no estimated hours', () => {
			const taskWithCompletion = { ...mockTask, estimatedHours: undefined, completionPercentage: 75 };
			const progress = calculateTaskProgress(taskWithCompletion, []);
			expect(progress).toBe(75);
		});
	});

	describe('Due Date Utilities', () => {
		it('should detect overdue tasks', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			
			const overdueTask = { ...mockTask, dueDate: yesterday.toISOString().split('T')[0] };
			expect(isTaskOverdue(overdueTask)).toBe(true);
		});

		it('should not consider completed tasks as overdue', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			
			const completedTask = { 
				...mockTask, 
				dueDate: yesterday.toISOString().split('T')[0],
				status: 'completed' as const
			};
			expect(isTaskOverdue(completedTask)).toBe(false);
		});

		it('should calculate days until due correctly', () => {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			
			const taskDueTomorrow = { ...mockTask, dueDate: tomorrow.toISOString().split('T')[0] };
			expect(getDaysUntilDue(taskDueTomorrow)).toBe(1);
		});

		it('should return null for tasks without due date', () => {
			const taskWithoutDue = { ...mockTask, dueDate: undefined };
			expect(getDaysUntilDue(taskWithoutDue)).toBeNull();
		});
	});

	describe('Summary Generation', () => {
		it('should generate project summary correctly', () => {
			const tasks = [mockTask];
			const summary = generateProjectSummary(mockProject, tasks, mockTimeEntries);
			
			expect(summary.project).toBe(mockProject);
			expect(summary.totalHours).toBe(5);
			expect(summary.totalBillable).toBe(450);
			expect(summary.taskCount).toBe(1);
			expect(summary.completedTasks).toBe(0);
			expect(summary.entryCount).toBe(2);
		});

		it('should generate task summary correctly', () => {
			const summary = generateTaskSummary(mockTask, mockTimeEntries, mockProject);
			
			expect(summary.task).toBe(mockTask);
			expect(summary.totalTime).toBe(5);
			expect(summary.totalBillable).toBe(450);
			expect(summary.entryCount).toBe(2);
			expect(summary.isOverdue).toBe(false);
		});
	});

	describe('UI Helper Functions', () => {
		it('should return correct priority color classes', () => {
			expect(getPriorityColorClass('urgent')).toContain('text-red-600');
			expect(getPriorityColorClass('high')).toContain('text-orange-600');
			expect(getPriorityColorClass('medium')).toContain('text-yellow-600');
			expect(getPriorityColorClass('low')).toContain('text-green-600');
		});

		it('should return correct status color classes', () => {
			expect(getStatusColorClass('completed')).toContain('text-green-600');
			expect(getStatusColorClass('in-progress')).toContain('text-blue-600');
			expect(getStatusColorClass('on-hold')).toContain('text-yellow-600');
			expect(getStatusColorClass('cancelled')).toContain('text-red-600');
			expect(getStatusColorClass('pending')).toContain('text-gray-600');
		});

		it('should return correct progress color classes', () => {
			expect(getProgressColorClass(95)).toBe('bg-green-500');
			expect(getProgressColorClass(75)).toBe('bg-blue-500');
			expect(getProgressColorClass(50)).toBe('bg-yellow-500');
			expect(getProgressColorClass(25)).toBe('bg-gray-400');
			expect(getProgressColorClass(50, true)).toBe('bg-red-500'); // overdue
		});

		it('should format progress percentage correctly', () => {
			expect(formatProgress(75.6)).toBe('76%');
			expect(formatProgress(0)).toBe('0%');
			expect(formatProgress(100)).toBe('100%');
		});
	});

	describe('Completion Estimation', () => {
		it('should estimate completion date based on recent work', () => {
			const taskWithEstimate = { ...mockTask, estimatedHours: 10 };
			const recentEntries = [
				{
					...mockTimeEntries[0],
					date: new Date().toISOString().split('T')[0], // today
					duration: 2
				}
			];
			
			const estimatedDate = estimateCompletionDate(taskWithEstimate, recentEntries);
			expect(estimatedDate).toBeInstanceOf(Date);
		});

		it('should return null for completed tasks', () => {
			const completedTask = { ...mockTask, status: 'completed' as const };
			const estimatedDate = estimateCompletionDate(completedTask, mockTimeEntries);
			expect(estimatedDate).toBeNull();
		});

		it('should return null for tasks without estimated hours', () => {
			const taskWithoutEstimate = { ...mockTask, estimatedHours: undefined };
			const estimatedDate = estimateCompletionDate(taskWithoutEstimate, mockTimeEntries);
			expect(estimatedDate).toBeNull();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty arrays gracefully', () => {
			expect(calculateTotalHours([])).toBe(0);
			expect(calculateProjectProgress(mockProject, [], [])).toBe(0);
			expect(generateProjectSummary(mockProject, [], [])).toBeDefined();
		});

		it('should handle tasks without time entries', () => {
			const progress = calculateTaskProgress(mockTask, []);
			expect(progress).toBe(0);
		});

		it('should handle projects without estimated hours', () => {
			const projectWithoutEstimate = { ...mockProject, estimatedHours: undefined };
			const progress = calculateProjectProgress(projectWithoutEstimate, [], mockTimeEntries);
			expect(progress).toBe(0);
		});
	});
});

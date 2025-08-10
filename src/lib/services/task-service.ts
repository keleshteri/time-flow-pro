/**
 * Task Service for TimeFlow Pro
 * 
 * Business logic for task management operations, progress tracking calculations,
 * due date and priority management, and relationship validation with projects.
 * 
 * @example
 * ```typescript
 * import { TaskService } from '$lib/services/task-service';
 * 
 * const service = new TaskService();
 * const validation = service.validateTask(taskData);
 * const summary = service.calculateTaskMetrics(task, timeEntries);
 * ```
 */

import type { 
	Task, 
	Project,
	TimeEntry, 
	TaskSummary, 
	TaskFilter,
	TaskProgress
} from '$lib/types/index.js';
import { 
	generateTaskSummary,
	calculateTaskProgress,
	isTaskOverdue,
	isTaskOnTrack,
	getDaysUntilDue,
	estimateCompletionDate
} from '$lib/utils/progress-utils.js';
import { validateRequired, validateNumber } from '$lib/utils/validationUtils.js';

export interface TaskValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export interface TaskMetrics {
	totalTasks: number;
	completedTasks: number;
	overdueTasks: number;
	tasksOnTrack: number;
	averageCompletionTime: number;
	totalEstimatedHours: number;
	totalActualHours: number;
	efficiencyRatio: number;
}

export class TaskService {
	/**
	 * Validate task data before creation or update
	 */
	validateTask(task: Partial<Task>, projects: Project[] = []): TaskValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		// Required field validation
		if (!validateRequired(task.title).isValid) {
			errors.push('Task title is required');
		}

		if (!validateRequired(task.projectId).isValid) {
			errors.push('Project ID is required');
		}

		// Project existence validation
		if (task.projectId && projects.length > 0) {
			const projectExists = projects.some(p => p.id === task.projectId);
			if (!projectExists) {
				errors.push('Selected project does not exist');
			}
		}

		// Estimated hours validation
		if (task.estimatedHours !== undefined && !validateNumber(task.estimatedHours, 0).isValid) {
			errors.push('Estimated hours must be a positive number');
		}

		// Due date validation
		if (task.dueDate) {
			const dueDate = new Date(task.dueDate);
			const now = new Date();
			
			if (isNaN(dueDate.getTime())) {
				errors.push('Due date must be a valid date');
			} else if (dueDate < now && task.status !== 'completed') {
				warnings.push('Due date is in the past');
			}
		}

		// Completion percentage validation
		if (task.completionPercentage !== undefined) {
			if (!validateNumber(task.completionPercentage, 0, 100).isValid) {
				errors.push('Completion percentage must be between 0 and 100');
			}
		}

		// Custom billing rate validation
		if (task.customBillingRate !== undefined && !validateNumber(task.customBillingRate, 0).isValid) {
			errors.push('Custom billing rate must be a positive number');
		}

		// Dependencies validation
		if (task.dependencies && task.dependencies.includes(task.id || '')) {
			errors.push('Task cannot depend on itself');
		}

		// Subtasks validation
		if (task.subtasks && task.subtasks.includes(task.id || '')) {
			errors.push('Task cannot be a subtask of itself');
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings
		};
	}

	/**
	 * Calculate comprehensive task metrics
	 */
	calculateTaskMetrics(
		task: Task,
		timeEntries: TimeEntry[],
		project?: Project
	): TaskSummary {
		return generateTaskSummary(task, timeEntries, project);
	}

	/**
	 * Calculate metrics for multiple tasks
	 */
	calculateOverallTaskMetrics(
		tasks: Task[],
		timeEntries: TimeEntry[]
	): TaskMetrics {
		const completedTasks = tasks.filter(t => t.status === 'completed').length;
		const overdueTasks = tasks.filter(t => isTaskOverdue(t)).length;
		const tasksOnTrack = tasks.filter(t => isTaskOnTrack(t, timeEntries)).length;

		// Calculate average completion time for completed tasks
		const completedTasksWithDuration = tasks
			.filter(t => t.status === 'completed' && t.completedAt)
			.map(t => {
				const created = new Date(t.createdAt);
				const completed = new Date(t.completedAt!);
				return (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24); // days
			});

		const averageCompletionTime = completedTasksWithDuration.length > 0
			? completedTasksWithDuration.reduce((sum, duration) => sum + duration, 0) / completedTasksWithDuration.length
			: 0;

		// Calculate estimated vs actual hours
		const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
		const totalActualHours = tasks.reduce((sum, task) => {
			const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
			return sum + calculateTotalHours(taskEntries);
		}, 0);

		const efficiencyRatio = totalEstimatedHours > 0 ? totalActualHours / totalEstimatedHours : 0;

		return {
			totalTasks: tasks.length,
			completedTasks,
			overdueTasks,
			tasksOnTrack,
			averageCompletionTime,
			totalEstimatedHours,
			totalActualHours,
			efficiencyRatio
		};
	}

	/**
	 * Filter tasks based on criteria
	 */
	filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
		return tasks.filter(task => {
			// Project filter
			if (filter.projectId && task.projectId !== filter.projectId) {
				return false;
			}

			// Status filter
			if (filter.status && !filter.status.includes(task.status)) {
				return false;
			}

			// Priority filter
			if (filter.priority && !filter.priority.includes(task.priority)) {
				return false;
			}

			// Assignee filter
			if (filter.assignee && task.assignee !== filter.assignee) {
				return false;
			}

			// Tags filter
			if (filter.tags && filter.tags.length > 0) {
				const hasMatchingTag = filter.tags.some(tag => 
					task.tags.some(taskTag => 
						taskTag.toLowerCase().includes(tag.toLowerCase())
					)
				);
				if (!hasMatchingTag) return false;
			}

			// Due date range filter
			if (filter.dueDateRange && task.dueDate) {
				const taskDueDate = new Date(task.dueDate);
				const filterStart = new Date(filter.dueDateRange.start);
				const filterEnd = new Date(filter.dueDateRange.end);

				if (taskDueDate < filterStart || taskDueDate > filterEnd) {
					return false;
				}
			}

			// Billable filter
			if (filter.isBillable !== undefined && task.isBillable !== filter.isBillable) {
				return false;
			}

			// Completion filter
			if (filter.isCompleted !== undefined) {
				const isCompleted = task.status === 'completed';
				if (isCompleted !== filter.isCompleted) {
					return false;
				}
			}

			// Overdue filter
			if (filter.isOverdue !== undefined) {
				const taskIsOverdue = isTaskOverdue(task);
				if (taskIsOverdue !== filter.isOverdue) {
					return false;
				}
			}

			// Search filter
			if (filter.search) {
				const searchTerm = filter.search.toLowerCase();
				const searchableText = [
					task.title,
					task.description || '',
					task.assignee || '',
					...task.tags
				].join(' ').toLowerCase();

				if (!searchableText.includes(searchTerm)) {
					return false;
				}
			}

			return true;
		});
	}

	/**
	 * Sort tasks by various criteria
	 */
	sortTasks(
		tasks: Task[], 
		sortBy: 'title' | 'priority' | 'status' | 'dueDate' | 'created' | 'progress',
		direction: 'asc' | 'desc' = 'asc',
		timeEntries: TimeEntry[] = []
	): Task[] {
		return [...tasks].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'title':
					comparison = a.title.localeCompare(b.title);
					break;
				case 'priority':
					const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
					comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
					break;
				case 'status':
					const statusOrder = { 'in-progress': 4, 'pending': 3, 'on-hold': 2, 'completed': 1, 'cancelled': 0 };
					comparison = statusOrder[a.status] - statusOrder[b.status];
					break;
				case 'dueDate':
					if (!a.dueDate && !b.dueDate) comparison = 0;
					else if (!a.dueDate) comparison = 1;
					else if (!b.dueDate) comparison = -1;
					else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
					break;
				case 'created':
					comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
				case 'progress':
					const progressA = calculateTaskProgress(a, timeEntries);
					const progressB = calculateTaskProgress(b, timeEntries);
					comparison = progressA - progressB;
					break;
			}

			return direction === 'desc' ? -comparison : comparison;
		});
	}

	/**
	 * Generate default task data
	 */
	generateDefaultTask(projectId: string, overrides: Partial<Task> = {}): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {
		return {
			projectId,
			title: '',
			description: '',
			estimatedHours: undefined,
			actualHours: 0,
			priority: 'medium',
			status: 'pending',
			asanaTaskId: undefined,
			tags: [],
			dueDate: undefined,
			assignee: undefined,
			completionPercentage: 0,
			isBillable: true,
			customBillingRate: undefined,
			dependencies: [],
			subtasks: [],
			notes: '',
			completedAt: undefined,
			...overrides
		};
	}

	/**
	 * Update task progress based on time entries
	 */
	updateTaskProgress(task: Task, timeEntries: TimeEntry[]): Partial<Task> {
		const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
		const actualHours = calculateTotalHours(taskEntries);
		const progress = calculateTaskProgress(task, timeEntries);

		const updates: Partial<Task> = {
			actualHours,
			completionPercentage: progress
		};

		// Auto-complete task if progress reaches 100% and estimated hours are met
		if (task.estimatedHours && actualHours >= task.estimatedHours && task.status !== 'completed') {
			updates.status = 'completed';
			updates.completedAt = new Date().toISOString();
		}

		return updates;
	}
}

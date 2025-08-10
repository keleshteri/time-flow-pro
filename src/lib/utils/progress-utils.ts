/**
 * Progress Calculation Utilities for TimeFlow Pro
 * 
 * Provides utilities for calculating project and task progress,
 * time allocation, status determination, and performance metrics.
 * 
 * @example
 * ```typescript
 * import { calculateProjectProgress, getTaskStatus } from '$lib/utils/progress-utils';
 * 
 * const progress = calculateProjectProgress(project, tasks, timeEntries);
 * const status = getTaskStatus(task, timeEntries);
 * ```
 */

import type { Project, Task, TimeEntry, ProjectSummary, TaskSummary } from '$lib/types/index.js';

/**
 * Calculate total hours from time entries
 */
export function calculateTotalHours(timeEntries: TimeEntry[]): number {
	return timeEntries.reduce((total, entry) => total + entry.duration, 0);
}

/**
 * Calculate billable hours from time entries
 */
export function calculateBillableHours(timeEntries: TimeEntry[]): number {
	return timeEntries.reduce((total, entry) => total + entry.billableHours, 0);
}

/**
 * Calculate total billable amount from time entries
 */
export function calculateBillableAmount(timeEntries: TimeEntry[], defaultRate: number): number {
	return timeEntries.reduce((total, entry) => {
		const rate = entry.billingRate || defaultRate;
		return total + (entry.billableHours * rate);
	}, 0);
}

/**
 * Calculate project progress percentage
 */
export function calculateProjectProgress(
	project: Project,
	tasks: Task[],
	timeEntries: TimeEntry[]
): number {
	const projectTasks = tasks.filter(task => task.projectId === project.id);
	
	if (projectTasks.length === 0) {
		// If no tasks, use time-based progress
		if (project.estimatedHours && project.estimatedHours > 0) {
			const actualHours = calculateTotalHours(
				timeEntries.filter(entry => entry.projectId === project.id)
			);
			return Math.min(100, (actualHours / project.estimatedHours) * 100);
		}
		return 0;
	}

	// Calculate based on task completion
	const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
	return (completedTasks / projectTasks.length) * 100;
}

/**
 * Calculate task progress percentage
 */
export function calculateTaskProgress(task: Task, timeEntries: TimeEntry[]): number {
	if (task.status === 'completed') return 100;
	if (task.status === 'cancelled') return 0;
	
	if (task.estimatedHours && task.estimatedHours > 0) {
		const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
		const actualHours = calculateTotalHours(taskEntries);
		return Math.min(100, (actualHours / task.estimatedHours) * 100);
	}
	
	// If no estimated hours, use completion percentage
	return task.completionPercentage || 0;
}

/**
 * Determine if a task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
	if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') {
		return false;
	}
	
	const dueDate = new Date(task.dueDate);
	const now = new Date();
	return now > dueDate;
}

/**
 * Calculate days until due date
 */
export function getDaysUntilDue(task: Task): number | null {
	if (!task.dueDate) return null;
	
	const dueDate = new Date(task.dueDate);
	const now = new Date();
	const diffTime = dueDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	return diffDays;
}

/**
 * Determine if a task is on track based on progress vs time remaining
 */
export function isTaskOnTrack(task: Task, timeEntries: TimeEntry[]): boolean {
	if (!task.estimatedHours || !task.dueDate) return true;
	if (task.status === 'completed') return true;
	if (task.status === 'cancelled') return false;
	
	const progress = calculateTaskProgress(task, timeEntries);
	const daysUntilDue = getDaysUntilDue(task);
	
	if (daysUntilDue === null || daysUntilDue < 0) return false;
	
	// Calculate expected progress based on time elapsed
	const now = new Date();
	const createdDate = new Date(task.createdAt);
	const dueDate = new Date(task.dueDate);
	
	const totalDuration = dueDate.getTime() - createdDate.getTime();
	const elapsedDuration = now.getTime() - createdDate.getTime();
	
	if (totalDuration <= 0) return true;
	
	const expectedProgress = (elapsedDuration / totalDuration) * 100;
	
	// Task is on track if actual progress is within 10% of expected progress
	return progress >= (expectedProgress - 10);
}

/**
 * Generate project summary with calculated metrics
 */
export function generateProjectSummary(
	project: Project,
	tasks: Task[],
	timeEntries: TimeEntry[]
): ProjectSummary {
	const projectTasks = tasks.filter(task => task.projectId === project.id);
	const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
	
	const totalHours = calculateTotalHours(projectEntries);
	const totalBillable = calculateBillableAmount(projectEntries, project.defaultBillingRate);
	const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
	const progressPercentage = calculateProjectProgress(project, tasks, timeEntries);
	
	// Find last activity
	const lastActivity = projectEntries.length > 0
		? projectEntries
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
			.updatedAt
		: undefined;
	
	return {
		project,
		totalHours,
		totalBillable,
		entryCount: projectEntries.length,
		taskCount: projectTasks.length,
		completedTasks,
		progressPercentage,
		lastActivity
	};
}

/**
 * Generate task summary with calculated metrics
 */
export function generateTaskSummary(
	task: Task,
	timeEntries: TimeEntry[],
	project?: Project
): TaskSummary {
	const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
	const totalTime = calculateTotalHours(taskEntries);
	const billingRate = project?.defaultBillingRate || 0;
	const totalBillable = calculateBillableAmount(taskEntries, billingRate);
	const progressPercentage = calculateTaskProgress(task, timeEntries);
	const isOverdue = isTaskOverdue(task);
	const daysUntilDue = getDaysUntilDue(task);
	
	// Find last activity
	const lastActivity = taskEntries.length > 0
		? taskEntries
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
			.updatedAt
		: undefined;
	
	return {
		task,
		totalTime,
		totalBillable,
		entryCount: taskEntries.length,
		progressPercentage,
		isOverdue,
		daysUntilDue,
		lastActivity
	};
}

/**
 * Get priority color class for UI styling
 */
export function getPriorityColorClass(priority: Task['priority']): string {
	switch (priority) {
		case 'urgent':
			return 'text-red-600 bg-red-50 border-red-200';
		case 'high':
			return 'text-orange-600 bg-orange-50 border-orange-200';
		case 'medium':
			return 'text-yellow-600 bg-yellow-50 border-yellow-200';
		case 'low':
			return 'text-green-600 bg-green-50 border-green-200';
		default:
			return 'text-gray-600 bg-gray-50 border-gray-200';
	}
}

/**
 * Get status color class for UI styling
 */
export function getStatusColorClass(status: Task['status']): string {
	switch (status) {
		case 'completed':
			return 'text-green-600 bg-green-50 border-green-200';
		case 'in-progress':
			return 'text-blue-600 bg-blue-50 border-blue-200';
		case 'on-hold':
			return 'text-yellow-600 bg-yellow-50 border-yellow-200';
		case 'cancelled':
			return 'text-red-600 bg-red-50 border-red-200';
		case 'pending':
		default:
			return 'text-gray-600 bg-gray-50 border-gray-200';
	}
}

/**
 * Get progress bar color class based on percentage
 */
export function getProgressColorClass(percentage: number, isOverdue: boolean = false): string {
	if (isOverdue) return 'bg-red-500';
	if (percentage >= 90) return 'bg-green-500';
	if (percentage >= 70) return 'bg-blue-500';
	if (percentage >= 40) return 'bg-yellow-500';
	return 'bg-gray-400';
}

/**
 * Format progress percentage for display
 */
export function formatProgress(percentage: number): string {
	return `${Math.round(percentage)}%`;
}

/**
 * Calculate estimated completion date based on current progress
 */
export function estimateCompletionDate(
	task: Task,
	timeEntries: TimeEntry[]
): Date | null {
	if (!task.estimatedHours || task.status === 'completed' || task.status === 'cancelled') {
		return null;
	}
	
	const taskEntries = timeEntries.filter(entry => entry.taskId === task.id);
	if (taskEntries.length === 0) return null;
	
	const totalHours = calculateTotalHours(taskEntries);
	const remainingHours = task.estimatedHours - totalHours;
	
	if (remainingHours <= 0) return new Date(); // Already complete
	
	// Calculate average hours per day from recent entries
	const recentEntries = taskEntries
		.filter(entry => {
			const entryDate = new Date(entry.date);
			const weekAgo = new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			return entryDate >= weekAgo;
		});
	
	if (recentEntries.length === 0) return null;
	
	const uniqueDays = new Set(recentEntries.map(entry => entry.date)).size;
	const averageHoursPerDay = calculateTotalHours(recentEntries) / uniqueDays;
	
	if (averageHoursPerDay <= 0) return null;
	
	const estimatedDays = Math.ceil(remainingHours / averageHoursPerDay);
	const completionDate = new Date();
	completionDate.setDate(completionDate.getDate() + estimatedDays);
	
	return completionDate;
}

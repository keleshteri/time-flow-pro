/**
 * Tasks Store for TimeFlow Pro
 * 
 * Dedicated Svelte store for task management with CRUD operations,
 * project relationship validation, progress calculation based on time entries,
 * and task filtering and sorting capabilities.
 * 
 * @example
 * ```typescript
 * import { tasks, activeTasks, createTask } from '$lib/stores/tasks';
 * 
 * // Subscribe to tasks
 * tasks.subscribe(taskList => {
 *   console.log('Tasks:', taskList);
 * });
 * 
 * // Create task
 * const taskId = createTask({
 *   projectId: 'project-123',
 *   title: 'New Task',
 *   priority: 'high'
 * });
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { Task, TaskSummary, TaskFilter, Project, TimeEntry } from '$lib/types/index.js';
import { eventBus } from '$lib/utils/eventBus.js';
import { getCurrentTimestamp } from '$lib/utils/dateUtils.js';
import { 
	generateTaskSummary, 
	calculateTaskProgress,
	isTaskOverdue,
	isTaskOnTrack,
	getDaysUntilDue
} from '$lib/utils/progress-utils.js';
import { TaskService } from '$lib/services/task-service.js';

// Storage key for localStorage persistence
const STORAGE_KEY = 'timeflow-tasks';

// Task service instance
const taskService = new TaskService();

/**
 * Load tasks from localStorage
 */
function loadTasksFromStorage(): Task[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error('Failed to load tasks from localStorage:', error);
		return [];
	}
}

/**
 * Save tasks to localStorage
 */
function saveTasksToStorage(tasks: Task[]): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	} catch (error) {
		console.error('Failed to save tasks to localStorage:', error);
		eventBus.emit('storage:error', { error, timestamp: new Date() });
	}
}

/**
 * Generate a unique ID
 */
function generateId(): string {
	return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create the writable store with initial data from localStorage
const { subscribe, set, update } = writable<Task[]>(loadTasksFromStorage());

/**
 * Create a new task
 */
export function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): string {
	const id = generateId();
	const now = getCurrentTimestamp();
	
	const newTask: Task = {
		...taskData,
		id,
		createdAt: now,
		updatedAt: now
	};

	update(tasks => {
		const updatedTasks = [...tasks, newTask];
		saveTasksToStorage(updatedTasks);
		return updatedTasks;
	});

	// Emit event
	eventBus.emit('task:created', {
		taskId: id,
		projectId: newTask.projectId,
		title: newTask.title
	});

	return id;
}

/**
 * Update an existing task
 */
export function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean {
	let updated = false;

	update(tasks => {
		const taskIndex = tasks.findIndex(t => t.id === taskId);
		if (taskIndex === -1) {
			throw new Error('Task not found');
		}

		const updatedTask: Task = {
			...tasks[taskIndex],
			...updates,
			updatedAt: getCurrentTimestamp()
		};

		const updatedTasks = [...tasks];
		updatedTasks[taskIndex] = updatedTask;
		updated = true;

		saveTasksToStorage(updatedTasks);

		// Emit event
		eventBus.emit('task:updated', {
			taskId,
			changes: updates
		});

		// Check if task was completed
		if (updates.status === 'completed' && tasks[taskIndex].status !== 'completed') {
			eventBus.emit('task:completed', {
				taskId,
				timestamp: new Date()
			});
		}

		return updatedTasks;
	});

	return updated;
}

/**
 * Delete a task
 */
export function deleteTask(taskId: string): boolean {
	let deleted = false;

	update(tasks => {
		const taskExists = tasks.some(t => t.id === taskId);
		if (!taskExists) {
			throw new Error('Task not found');
		}

		const updatedTasks = tasks.filter(t => t.id !== taskId);
		deleted = true;

		saveTasksToStorage(updatedTasks);

		// Emit event
		eventBus.emit('task:deleted', { taskId });

		return updatedTasks;
	});

	return deleted;
}

/**
 * Complete a task
 */
export function completeTask(taskId: string): boolean {
	return updateTask(taskId, { 
		status: 'completed', 
		completionPercentage: 100,
		completedAt: getCurrentTimestamp()
	});
}

/**
 * Start working on a task
 */
export function startTask(taskId: string): boolean {
	return updateTask(taskId, { status: 'in-progress' });
}

/**
 * Pause a task
 */
export function pauseTask(taskId: string): boolean {
	return updateTask(taskId, { status: 'on-hold' });
}

/**
 * Cancel a task
 */
export function cancelTask(taskId: string): boolean {
	return updateTask(taskId, { status: 'cancelled' });
}

/**
 * Get task by ID (non-reactive)
 */
export function getTask(taskId: string): Task | undefined {
	const tasks = get({ subscribe });
	return tasks.find(t => t.id === taskId);
}

/**
 * Get tasks by project ID
 */
export function getTasksByProject(projectId: string): Task[] {
	const tasks = get({ subscribe });
	return tasks.filter(t => t.projectId === projectId);
}

/**
 * Filter tasks
 */
export function filterTasks(filter: TaskFilter): Task[] {
	const tasks = get({ subscribe });
	return taskService.filterTasks(tasks, filter);
}

/**
 * Sort tasks
 */
export function sortTasks(
	sortBy: 'title' | 'priority' | 'status' | 'dueDate' | 'created' | 'progress',
	direction: 'asc' | 'desc' = 'asc'
): Task[] {
	const tasks = get({ subscribe });
	// Note: For progress sorting, we need timeEntries which will be handled by components
	return taskService.sortTasks(tasks, sortBy, direction);
}

/**
 * Clear all tasks
 */
export function clearAllTasks(): void {
	set([]);
	saveTasksToStorage([]);
	eventBus.emit('tasks:cleared', { timestamp: new Date() });
}

/**
 * Import tasks from JSON
 */
export function importTasks(tasksData: Task[]): void {
	set(tasksData);
	saveTasksToStorage(tasksData);
	eventBus.emit('tasks:imported', { count: tasksData.length, timestamp: new Date() });
}

/**
 * Export tasks to JSON
 */
export function exportTasks(): Task[] {
	return get({ subscribe });
}

// Derived stores for computed values
export const activeTasks = derived(
	{ subscribe },
	tasks => tasks.filter(t => t.status === 'in-progress' || t.status === 'pending')
);

export const completedTasks = derived(
	{ subscribe },
	tasks => tasks.filter(t => t.status === 'completed')
);

export const overdueTasks = derived(
	{ subscribe },
	tasks => tasks.filter(t => isTaskOverdue(t))
);

export const urgentTasks = derived(
	{ subscribe },
	tasks => tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed')
);

export const tasksByPriority = derived(
	{ subscribe },
	tasks => {
		const priorityMap = new Map<Task['priority'], Task[]>();
		tasks.forEach(task => {
			const priorityTasks = priorityMap.get(task.priority) || [];
			priorityTasks.push(task);
			priorityMap.set(task.priority, priorityTasks);
		});
		return priorityMap;
	}
);

export const tasksByStatus = derived(
	{ subscribe },
	tasks => {
		const statusMap = new Map<Task['status'], Task[]>();
		tasks.forEach(task => {
			const statusTasks = statusMap.get(task.status) || [];
			statusTasks.push(task);
			statusMap.set(task.status, statusTasks);
		});
		return statusMap;
	}
);

export const tasksByProject = derived(
	{ subscribe },
	tasks => {
		const projectMap = new Map<string, Task[]>();
		tasks.forEach(task => {
			const projectTasks = projectMap.get(task.projectId) || [];
			projectTasks.push(task);
			projectMap.set(task.projectId, projectTasks);
		});
		return projectMap;
	}
);

// Export the main store
export const tasks = { subscribe };

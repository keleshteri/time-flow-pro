/**
 * TimeFlow Pro Project Store
 * 
 * Reactive Svelte store for managing projects, tasks, and time entries.
 * Provides CRUD operations and reactive state management for project data.
 * 
 * @example
 * ```typescript
 * import { projectStore } from '$lib/stores/projectStore';
 * 
 * // Subscribe to projects
 * projectStore.subscribe(state => {
 *   console.log('Projects:', state.projects);
 * });
 * 
 * // Create project
 * projectStore.createProject({ name: 'New Project', description: 'Description' });
 * 
 * // Get project by ID
 * const project = projectStore.getProject('project-id');
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { Project, Task, TimeEntry, ProjectSummary, TaskSummary } from '$lib/types/index.js';
import { eventBus } from '$lib/utils/eventBus.js';
import { getCurrentTimestamp } from '$lib/utils/dateUtils.js';
import {
	generateProjectSummary,
	generateTaskSummary,
	calculateTotalHours,
	calculateProjectProgress,
	calculateTaskProgress
} from '$lib/utils/progress-utils.js';

// Project store state interface
interface ProjectStoreState {
	projects: Project[];
	tasks: Task[];
	timeEntries: TimeEntry[];
	selectedProjectId: string | null;
	selectedTaskId: string | null;
	loading: boolean;
	error: string | null;
}

// Initial state
const initialState: ProjectStoreState = {
	projects: [],
	tasks: [],
	timeEntries: [],
	selectedProjectId: null,
	selectedTaskId: null,
	loading: false,
	error: null
};

// Storage keys for localStorage persistence
const STORAGE_KEYS = {
	projects: 'timeflow-projects',
	tasks: 'timeflow-tasks',
	timeEntries: 'timeflow-time-entries',
	selections: 'timeflow-selections'
};

// Load initial state from localStorage
function loadFromStorage(): ProjectStoreState {
	if (typeof window === 'undefined') return initialState;

	try {
		const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects) || '[]');
		const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || '[]');
		const timeEntries = JSON.parse(localStorage.getItem(STORAGE_KEYS.timeEntries) || '[]');
		const selections = JSON.parse(localStorage.getItem(STORAGE_KEYS.selections) || '{}');

		return {
			...initialState,
			projects,
			tasks,
			timeEntries,
			selectedProjectId: selections.selectedProjectId || null,
			selectedTaskId: selections.selectedTaskId || null
		};
	} catch (error) {
		console.error('Failed to load project data from localStorage:', error);
		return initialState;
	}
}

// Save state to localStorage
function saveToStorage(state: ProjectStoreState): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(state.projects));
		localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
		localStorage.setItem(STORAGE_KEYS.timeEntries, JSON.stringify(state.timeEntries));
		localStorage.setItem(STORAGE_KEYS.selections, JSON.stringify({
			selectedProjectId: state.selectedProjectId,
			selectedTaskId: state.selectedTaskId
		}));
	} catch (error) {
		console.error('Failed to save project data to localStorage:', error);
		eventBus.emit('storage:error', { error, timestamp: new Date() });
	}
}

// Create the writable store with initial data from localStorage
const { subscribe, set, update } = writable<ProjectStoreState>(loadFromStorage());

/**
 * Generate a unique ID
 */
function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new project
 */
function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): string {
	const id = generateId();
	const now = getCurrentTimestamp();
	
	const newProject: Project = {
		...projectData,
		id,
		createdAt: now,
		updatedAt: now
	};

	update(state => {
		const newState = {
			...state,
			projects: [...state.projects, newProject],
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	// Emit event
	eventBus.emit('project:created', {
		projectId: id,
		name: newProject.name
	});

	return id;
}

/**
 * Update an existing project
 */
function updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): boolean {
	let updated = false;

	update(state => {
		const projectIndex = state.projects.findIndex(p => p.id === projectId);
		if (projectIndex === -1) {
			return { ...state, error: 'Project not found' };
		}

		const updatedProject: Project = {
			...state.projects[projectIndex],
			...updates,
			updatedAt: getCurrentTimestamp()
		};

		const newProjects = [...state.projects];
		newProjects[projectIndex] = updatedProject;
		updated = true;

		// Emit event
		eventBus.emit('project:updated', {
			projectId,
			changes: updates
		});

		const newState = {
			...state,
			projects: newProjects,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return updated;
}

/**
 * Delete a project and all associated tasks and time entries
 */
function deleteProject(projectId: string): boolean {
	let deleted = false;

	update(state => {
		const projectExists = state.projects.some(p => p.id === projectId);
		if (!projectExists) {
			return { ...state, error: 'Project not found' };
		}

		// Remove project, associated tasks, and time entries
		const newProjects = state.projects.filter(p => p.id !== projectId);
		const newTasks = state.tasks.filter(t => t.projectId !== projectId);
		const newTimeEntries = state.timeEntries.filter(e => e.projectId !== projectId);

		deleted = true;

		// Clear selection if deleted project was selected
		const newSelectedProjectId = state.selectedProjectId === projectId ? null : state.selectedProjectId;
		const newSelectedTaskId = state.selectedTaskId && 
			state.tasks.find(t => t.id === state.selectedTaskId)?.projectId === projectId 
			? null : state.selectedTaskId;

		// Emit event
		eventBus.emit('project:deleted', { projectId });

		const newState = {
			...state,
			projects: newProjects,
			tasks: newTasks,
			timeEntries: newTimeEntries,
			selectedProjectId: newSelectedProjectId,
			selectedTaskId: newSelectedTaskId,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return deleted;
}

/**
 * Create a new task
 */
function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): string {
	const id = generateId();
	const now = getCurrentTimestamp();
	
	const newTask: Task = {
		...taskData,
		id,
		createdAt: now,
		updatedAt: now
	};

	update(state => {
		const newState = {
			...state,
			tasks: [...state.tasks, newTask],
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	// Emit event
	eventBus.emit('task:created', {
		taskId: id,
		projectId: newTask.projectId,
		name: newTask.name
	});

	return id;
}

/**
 * Update an existing task
 */
function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): boolean {
	let updated = false;

	update(state => {
		const taskIndex = state.tasks.findIndex(t => t.id === taskId);
		if (taskIndex === -1) {
			return { ...state, error: 'Task not found' };
		}

		const updatedTask: Task = {
			...state.tasks[taskIndex],
			...updates,
			updatedAt: getCurrentTimestamp()
		};

		const newTasks = [...state.tasks];
		newTasks[taskIndex] = updatedTask;
		updated = true;

		// Emit event
		eventBus.emit('task:updated', {
			taskId,
			changes: updates
		});

		// Check if task was completed
		if (updates.status === 'completed' && state.tasks[taskIndex].status !== 'completed') {
			eventBus.emit('task:completed', {
				taskId,
				timestamp: new Date()
			});
		}

		const newState = {
			...state,
			tasks: newTasks,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return updated;
}

/**
 * Delete a task and all associated time entries
 */
function deleteTask(taskId: string): boolean {
	let deleted = false;

	update(state => {
		const taskExists = state.tasks.some(t => t.id === taskId);
		if (!taskExists) {
			return { ...state, error: 'Task not found' };
		}

		// Remove task and associated time entries
		const newTasks = state.tasks.filter(t => t.id !== taskId);
		const newTimeEntries = state.timeEntries.filter(e => e.taskId !== taskId);

		deleted = true;

		// Clear selection if deleted task was selected
		const newSelectedTaskId = state.selectedTaskId === taskId ? null : state.selectedTaskId;

		// Emit event
		eventBus.emit('task:deleted', { taskId });

		const newState = {
			...state,
			tasks: newTasks,
			timeEntries: newTimeEntries,
			selectedTaskId: newSelectedTaskId,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return deleted;
}

/**
 * Create a new time entry
 */
function createTimeEntry(entryData: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
	const id = generateId();
	const now = getCurrentTimestamp();
	
	const newEntry: TimeEntry = {
		...entryData,
		id,
		createdAt: now,
		updatedAt: now
	};

	update(state => {
		const newState = {
			...state,
			timeEntries: [...state.timeEntries, newEntry],
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	// Emit event
	eventBus.emit('timeEntry:created', {
		entryId: id,
		projectId: newEntry.projectId,
		taskId: newEntry.taskId
	});

	return id;
}

/**
 * Update an existing time entry
 */
function updateTimeEntry(entryId: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>): boolean {
	let updated = false;

	update(state => {
		const entryIndex = state.timeEntries.findIndex(e => e.id === entryId);
		if (entryIndex === -1) {
			return { ...state, error: 'Time entry not found' };
		}

		const updatedEntry: TimeEntry = {
			...state.timeEntries[entryIndex],
			...updates,
			updatedAt: getCurrentTimestamp()
		};

		const newEntries = [...state.timeEntries];
		newEntries[entryIndex] = updatedEntry;
		updated = true;

		// Emit event
		eventBus.emit('timeEntry:updated', {
			entryId,
			changes: updates
		});

		const newState = {
			...state,
			timeEntries: newEntries,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return updated;
}

/**
 * Delete a time entry
 */
function deleteTimeEntry(entryId: string): boolean {
	let deleted = false;

	update(state => {
		const entryExists = state.timeEntries.some(e => e.id === entryId);
		if (!entryExists) {
			return { ...state, error: 'Time entry not found' };
		}

		const newEntries = state.timeEntries.filter(e => e.id !== entryId);
		deleted = true;

		// Emit event
		eventBus.emit('timeEntry:deleted', { entryId });

		const newState = {
			...state,
			timeEntries: newEntries,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});

	return deleted;
}

/**
 * Select a project
 */
function selectProject(projectId: string | null): void {
	update(state => {
		// Emit event if project changed
		if (projectId && projectId !== state.selectedProjectId) {
			eventBus.emit('project:selected', { projectId });
		}

		const newState = {
			...state,
			selectedProjectId: projectId,
			selectedTaskId: null, // Clear task selection when project changes
			error: null
		};
		saveToStorage(newState);
		return newState;
	});
}

/**
 * Select a task
 */
function selectTask(taskId: string | null): void {
	update(state => {
		const newState = {
			...state,
			selectedTaskId: taskId,
			error: null
		};
		saveToStorage(newState);
		return newState;
	});
}

/**
 * Get project by ID (non-reactive)
 */
function getProject(projectId: string): Project | undefined {
	const state = get({ subscribe });
	return state.projects.find(p => p.id === projectId);
}

/**
 * Get task by ID (non-reactive)
 */
function getTask(taskId: string): Task | undefined {
	const state = get({ subscribe });
	return state.tasks.find(t => t.id === taskId);
}

/**
 * Get time entry by ID (non-reactive)
 */
function getTimeEntry(entryId: string): TimeEntry | undefined {
	const state = get({ subscribe });
	return state.timeEntries.find(e => e.id === entryId);
}

/**
 * Clear all data
 */
function clearAll(): void {
	set(initialState);
}

/**
 * Set loading state
 */
function setLoading(loading: boolean): void {
	update(state => ({ ...state, loading }));
}

/**
 * Set error state
 */
function setError(error: string | null): void {
	update(state => ({ ...state, error }));
}

// Derived stores for computed values
export const selectedProject = derived(
	{ subscribe },
	state => state.selectedProjectId ? state.projects.find(p => p.id === state.selectedProjectId) : null
);

export const selectedTask = derived(
	{ subscribe },
	state => state.selectedTaskId ? state.tasks.find(t => t.id === state.selectedTaskId) : null
);

export const projectsWithTasks = derived(
	{ subscribe },
	state => state.projects.map(project => ({
		...project,
		tasks: state.tasks.filter(task => task.projectId === project.id)
	}))
);

export const selectedProjectTasks = derived(
	{ subscribe },
	state => state.selectedProjectId
		? state.tasks.filter(t => t.projectId === state.selectedProjectId)
		: []
);

// Derived stores for progress tracking and summaries
export const projectSummaries = derived(
	{ subscribe },
	state => state.projects.map(project =>
		generateProjectSummary(project, state.tasks, state.timeEntries)
	)
);

export const taskSummaries = derived(
	{ subscribe },
	state => state.tasks.map(task => {
		const project = state.projects.find(p => p.id === task.projectId);
		return generateTaskSummary(task, state.timeEntries, project);
	})
);

export const activeProjects = derived(
	{ subscribe },
	state => state.projects.filter(p => p.status === 'active' && !p.isArchived)
);

export const completedProjects = derived(
	{ subscribe },
	state => state.projects.filter(p => p.status === 'completed')
);

export const overdueTasks = derived(
	{ subscribe },
	state => state.tasks.filter(task => {
		if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') {
			return false;
		}
		const dueDate = new Date(task.dueDate);
		const now = new Date();
		return now > dueDate;
	})
);

export const activeTasks = derived(
	{ subscribe },
	state => state.tasks.filter(t => t.status === 'in-progress' || t.status === 'pending')
);

export const projectProgress = derived(
	{ subscribe },
	state => {
		const progressMap = new Map<string, number>();
		state.projects.forEach(project => {
			const progress = calculateProjectProgress(project, state.tasks, state.timeEntries);
			progressMap.set(project.id, progress);
		});
		return progressMap;
	}
);

export const taskProgress = derived(
	{ subscribe },
	state => {
		const progressMap = new Map<string, number>();
		state.tasks.forEach(task => {
			const progress = calculateTaskProgress(task, state.timeEntries);
			progressMap.set(task.id, progress);
		});
		return progressMap;
	}
);

export const timeEntries = derived(
	{ subscribe },
	state => state.timeEntries
);

// Export the store with methods
export const projectStore = {
	subscribe,
	createProject,
	updateProject,
	deleteProject,
	createTask,
	updateTask,
	deleteTask,
	createTimeEntry,
	updateTimeEntry,
	deleteTimeEntry,
	selectProject,
	selectTask,
	getProject,
	getTask,
	getTimeEntry,
	clearAll,
	setLoading,
	setError
};

// All derived stores are already exported individually above

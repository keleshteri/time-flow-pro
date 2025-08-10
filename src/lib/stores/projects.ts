/**
 * Projects Store for TimeFlow Pro
 * 
 * Dedicated Svelte store for project management with CRUD operations,
 * derived stores for active projects and project summaries,
 * and integration with localStorage persistence.
 * 
 * @example
 * ```typescript
 * import { projects, activeProjects, createProject } from '$lib/stores/projects';
 * 
 * // Subscribe to projects
 * projects.subscribe(projectList => {
 *   console.log('Projects:', projectList);
 * });
 * 
 * // Create project
 * const projectId = createProject({
 *   name: 'New Project',
 *   clientName: 'Client Name',
 *   defaultBillingRate: 75
 * });
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { Project, ProjectSummary, ProjectFilter } from '$lib/types/index.js';
import { eventBus } from '$lib/utils/eventBus.js';
import { getCurrentTimestamp } from '$lib/utils/dateUtils.js';
import { generateProjectSummary, calculateProjectProgress } from '$lib/utils/progress-utils.js';
import { ProjectService } from '$lib/services/project-service.js';

// Storage key for localStorage persistence
const STORAGE_KEY = 'timeflow-projects';

// Project service instance
const projectService = new ProjectService();

/**
 * Load projects from localStorage
 */
function loadProjectsFromStorage(): Project[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error('Failed to load projects from localStorage:', error);
		return [];
	}
}

/**
 * Save projects to localStorage
 */
function saveProjectsToStorage(projects: Project[]): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
	} catch (error) {
		console.error('Failed to save projects to localStorage:', error);
		eventBus.emit('storage:error', { error, timestamp: new Date() });
	}
}

/**
 * Generate a unique ID
 */
function generateId(): string {
	return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create the writable store with initial data from localStorage
const { subscribe, set, update } = writable<Project[]>(loadProjectsFromStorage());

/**
 * Create a new project
 */
export function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): string {
	// Validate project data
	const validation = projectService.validateProject(projectData);
	if (!validation.isValid) {
		throw new Error(`Invalid project data: ${validation.errors.join(', ')}`);
	}

	const id = generateId();
	const now = getCurrentTimestamp();
	
	const newProject: Project = {
		...projectData,
		id,
		createdAt: now,
		updatedAt: now
	};

	update(projects => {
		const updatedProjects = [...projects, newProject];
		saveProjectsToStorage(updatedProjects);
		return updatedProjects;
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
export function updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): boolean {
	let updated = false;

	update(projects => {
		const projectIndex = projects.findIndex(p => p.id === projectId);
		if (projectIndex === -1) {
			throw new Error('Project not found');
		}

		const updatedProject: Project = {
			...projects[projectIndex],
			...updates,
			updatedAt: getCurrentTimestamp()
		};

		// Validate updated project
		const validation = projectService.validateProject(updatedProject);
		if (!validation.isValid) {
			throw new Error(`Invalid project data: ${validation.errors.join(', ')}`);
		}

		const updatedProjects = [...projects];
		updatedProjects[projectIndex] = updatedProject;
		updated = true;

		saveProjectsToStorage(updatedProjects);

		// Emit event
		eventBus.emit('project:updated', {
			projectId,
			changes: updates
		});

		return updatedProjects;
	});

	return updated;
}

/**
 * Delete a project
 */
export function deleteProject(projectId: string): boolean {
	let deleted = false;

	update(projects => {
		const projectExists = projects.some(p => p.id === projectId);
		if (!projectExists) {
			throw new Error('Project not found');
		}

		const updatedProjects = projects.filter(p => p.id !== projectId);
		deleted = true;

		saveProjectsToStorage(updatedProjects);

		// Emit event
		eventBus.emit('project:deleted', { projectId });

		return updatedProjects;
	});

	return deleted;
}

/**
 * Archive a project
 */
export function archiveProject(projectId: string): boolean {
	return updateProject(projectId, { isArchived: true, status: 'archived' });
}

/**
 * Unarchive a project
 */
export function unarchiveProject(projectId: string): boolean {
	return updateProject(projectId, { isArchived: false, status: 'active' });
}

/**
 * Get project by ID (non-reactive)
 */
export function getProject(projectId: string): Project | undefined {
	const projects = get({ subscribe });
	return projects.find(p => p.id === projectId);
}

/**
 * Filter projects
 */
export function filterProjects(filter: ProjectFilter): Project[] {
	const projects = get({ subscribe });
	return projectService.filterProjects(projects, filter);
}

/**
 * Sort projects
 */
export function sortProjects(
	sortBy: 'name' | 'client' | 'created' | 'updated' | 'progress' | 'revenue',
	direction: 'asc' | 'desc' = 'asc'
): Project[] {
	const projects = get({ subscribe });
	// Note: For progress and revenue sorting, we need tasks and timeEntries
	// This will be handled by the components that have access to all stores
	return projectService.sortProjects(projects, sortBy, direction);
}

/**
 * Clear all projects
 */
export function clearAllProjects(): void {
	set([]);
	saveProjectsToStorage([]);
	eventBus.emit('projects:cleared', { timestamp: new Date() });
}

/**
 * Import projects from JSON
 */
export function importProjects(projectsData: Project[]): void {
	// Validate all projects before importing
	projectsData.forEach((project, index) => {
		const validation = projectService.validateProject(project);
		if (!validation.isValid) {
			throw new Error(`Invalid project at index ${index}: ${validation.errors.join(', ')}`);
		}
	});

	set(projectsData);
	saveProjectsToStorage(projectsData);
	eventBus.emit('projects:imported', { count: projectsData.length, timestamp: new Date() });
}

/**
 * Export projects to JSON
 */
export function exportProjects(): Project[] {
	return get({ subscribe });
}

// Derived stores for computed values
export const activeProjects = derived(
	{ subscribe },
	projects => projects.filter(p => p.status === 'active' && !p.isArchived)
);

export const archivedProjects = derived(
	{ subscribe },
	projects => projects.filter(p => p.isArchived)
);

export const completedProjects = derived(
	{ subscribe },
	projects => projects.filter(p => p.status === 'completed')
);

export const billableProjects = derived(
	{ subscribe },
	projects => projects.filter(p => p.isBillable)
);

export const projectsByClient = derived(
	{ subscribe },
	projects => {
		const clientMap = new Map<string, Project[]>();
		projects.forEach(project => {
			const clientProjects = clientMap.get(project.clientName) || [];
			clientProjects.push(project);
			clientMap.set(project.clientName, clientProjects);
		});
		return clientMap;
	}
);

export const projectColorMap = derived(
	{ subscribe },
	projects => {
		const colorMap = new Map<string, string>();
		projects.forEach(project => {
			colorMap.set(project.id, project.colorCode);
		});
		return colorMap;
	}
);

// Export the main store
export const projects = { subscribe };

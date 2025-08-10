/**
 * Project Service for TimeFlow Pro
 * 
 * Business logic for project operations, progress calculation algorithms,
 * data validation and integrity checks, and integration with time entry calculations.
 * 
 * @example
 * ```typescript
 * import { ProjectService } from '$lib/services/project-service';
 * 
 * const service = new ProjectService();
 * const validation = service.validateProject(projectData);
 * const progress = service.calculateProjectMetrics(project, tasks, timeEntries);
 * ```
 */

import type { 
	Project, 
	Task, 
	TimeEntry, 
	ProjectSummary, 
	ProjectFilter 
} from '$lib/types/index.js';
import { 
	generateProjectSummary,
	calculateProjectProgress,
	calculateTotalHours,
	calculateBillableAmount
} from '$lib/utils/progress-utils.js';
import { validateRequired, validateEmail, validateNumber } from '$lib/utils/validationUtils.js';

export interface ProjectValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export interface ProjectMetrics {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	totalRevenue: number;
	averageProjectDuration: number;
	mostProfitableProject?: Project;
	leastProfitableProject?: Project;
}

export class ProjectService {
	/**
	 * Validate project data before creation or update
	 */
	validateProject(project: Partial<Project>): ProjectValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		// Required field validation
		if (!validateRequired(project.name).isValid) {
			errors.push('Project name is required');
		}

		if (!validateRequired(project.clientName).isValid) {
			errors.push('Client name is required');
		}

		if (project.defaultBillingRate !== undefined && !validateNumber(project.defaultBillingRate, 0).isValid) {
			errors.push('Default billing rate must be a positive number');
		}

		// Color code validation
		if (project.colorCode && !/^#[0-9A-F]{6}$/i.test(project.colorCode)) {
			errors.push('Color code must be a valid hex color (e.g., #FF5733)');
		}

		// Budget validation
		if (project.budget !== undefined && project.budget < 0) {
			errors.push('Budget must be a positive number');
		}

		// Date validation
		if (project.startDate && project.endDate) {
			const startDate = new Date(project.startDate);
			const endDate = new Date(project.endDate);
			
			if (startDate >= endDate) {
				errors.push('End date must be after start date');
			}
		}

		// Estimated hours validation
		if (project.estimatedHours === undefined) {
			warnings.push('Estimated hours should be greater than 0 for better progress tracking');
		} else if (project.estimatedHours <= 0) {
			warnings.push('Estimated hours should be greater than 0 for better progress tracking');
		}

		// Currency validation
		if (project.currency && !/^[A-Z]{3}$/.test(project.currency)) {
			warnings.push('Currency should be a 3-letter ISO code (e.g., USD, EUR)');
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings
		};
	}

	/**
	 * Calculate comprehensive project metrics
	 */
	calculateProjectMetrics(
		project: Project,
		tasks: Task[],
		timeEntries: TimeEntry[]
	): ProjectSummary {
		return generateProjectSummary(project, tasks, timeEntries);
	}

	/**
	 * Calculate metrics for multiple projects
	 */
	calculateOverallMetrics(
		projects: Project[],
		tasks: Task[],
		timeEntries: TimeEntry[]
	): ProjectMetrics {
		const activeProjects = projects.filter(p => p.status === 'active').length;
		const completedProjects = projects.filter(p => p.status === 'completed').length;

		// Calculate total revenue
		const totalRevenue = projects.reduce((total, project) => {
			const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
			return total + calculateBillableAmount(projectEntries, project.defaultBillingRate);
		}, 0);

		// Calculate average project duration
		const completedProjectsWithDuration = projects
			.filter(p => p.status === 'completed' && p.startDate && p.endDate)
			.map(p => {
				const start = new Date(p.startDate!);
				const end = new Date(p.endDate!);
				return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
			});

		const averageProjectDuration = completedProjectsWithDuration.length > 0
			? completedProjectsWithDuration.reduce((sum, duration) => sum + duration, 0) / completedProjectsWithDuration.length
			: 0;

		// Find most and least profitable projects
		const projectProfitability = projects.map(project => {
			const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
			const revenue = calculateBillableAmount(projectEntries, project.defaultBillingRate);
			return { project, revenue };
		});

		const sortedByRevenue = projectProfitability.sort((a, b) => b.revenue - a.revenue);
		const mostProfitableProject = sortedByRevenue[0]?.project;
		const leastProfitableProject = sortedByRevenue[sortedByRevenue.length - 1]?.project;

		return {
			totalProjects: projects.length,
			activeProjects,
			completedProjects,
			totalRevenue,
			averageProjectDuration,
			mostProfitableProject,
			leastProfitableProject
		};
	}

	/**
	 * Filter projects based on criteria
	 */
	filterProjects(projects: Project[], filter: ProjectFilter): Project[] {
		return projects.filter(project => {
			// Status filter
			if (filter.status && !filter.status.includes(project.status)) {
				return false;
			}

			// Client name filter
			if (filter.clientName && !project.clientName.toLowerCase().includes(filter.clientName.toLowerCase())) {
				return false;
			}

			// Tags filter
			if (filter.tags && filter.tags.length > 0) {
				const hasMatchingTag = filter.tags.some(tag => 
					project.tags.some(projectTag => 
						projectTag.toLowerCase().includes(tag.toLowerCase())
					)
				);
				if (!hasMatchingTag) return false;
			}

			// Date range filter
			if (filter.dateRange) {
				const projectStart = project.startDate ? new Date(project.startDate) : null;
				const projectEnd = project.endDate ? new Date(project.endDate) : null;
				const filterStart = new Date(filter.dateRange.start);
				const filterEnd = new Date(filter.dateRange.end);

				// Check if project overlaps with filter range
				if (projectStart && projectEnd) {
					if (projectEnd < filterStart || projectStart > filterEnd) {
						return false;
					}
				}
			}

			// Billable filter
			if (filter.isBillable !== undefined && project.isBillable !== filter.isBillable) {
				return false;
			}

			// Archived filter
			if (filter.isArchived !== undefined && project.isArchived !== filter.isArchived) {
				return false;
			}

			// Search filter
			if (filter.search) {
				const searchTerm = filter.search.toLowerCase();
				const searchableText = [
					project.name,
					project.clientName,
					project.description || '',
					...project.tags
				].join(' ').toLowerCase();

				if (!searchableText.includes(searchTerm)) {
					return false;
				}
			}

			return true;
		});
	}

	/**
	 * Sort projects by various criteria
	 */
	sortProjects(
		projects: Project[], 
		sortBy: 'name' | 'client' | 'created' | 'updated' | 'progress' | 'revenue',
		direction: 'asc' | 'desc' = 'asc',
		tasks: Task[] = [],
		timeEntries: TimeEntry[] = []
	): Project[] {
		return [...projects].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'client':
					comparison = a.clientName.localeCompare(b.clientName);
					break;
				case 'created':
					comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
				case 'updated':
					comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
					break;
				case 'progress':
					const progressA = calculateProjectProgress(a, tasks, timeEntries);
					const progressB = calculateProjectProgress(b, tasks, timeEntries);
					comparison = progressA - progressB;
					break;
				case 'revenue':
					const entriesA = timeEntries.filter(e => e.projectId === a.id);
					const entriesB = timeEntries.filter(e => e.projectId === b.id);
					const revenueA = calculateBillableAmount(entriesA, a.defaultBillingRate);
					const revenueB = calculateBillableAmount(entriesB, b.defaultBillingRate);
					comparison = revenueA - revenueB;
					break;
			}

			return direction === 'desc' ? -comparison : comparison;
		});
	}

	/**
	 * Get project color palette for UI
	 */
	getProjectColorPalette(): string[] {
		return [
			'#3B82F6', // Blue
			'#10B981', // Green
			'#F59E0B', // Yellow
			'#EF4444', // Red
			'#8B5CF6', // Purple
			'#06B6D4', // Cyan
			'#F97316', // Orange
			'#84CC16', // Lime
			'#EC4899', // Pink
			'#6B7280'  // Gray
		];
	}

	/**
	 * Generate default project data
	 */
	generateDefaultProject(overrides: Partial<Project> = {}): Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {
		const colors = this.getProjectColorPalette();
		const randomColor = colors[Math.floor(Math.random() * colors.length)];

		return {
			name: '',
			clientName: '',
			description: '',
			defaultBillingRate: 75, // Default rate
			colorCode: randomColor,
			status: 'active',
			estimatedHours: undefined,
			actualHours: 0,
			budget: undefined,
			currency: 'USD',
			startDate: undefined,
			endDate: undefined,
			tags: [],
			isBillable: true,
			isArchived: false,
			...overrides
		};
	}
}

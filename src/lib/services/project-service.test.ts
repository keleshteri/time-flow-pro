/**
 * Project Service Tests for TimeFlow Pro
 * 
 * Tests for project business logic, validation, filtering, sorting,
 * and metrics calculation functionality.
 */

import { describe, it, expect } from 'vitest';
import { ProjectService } from './project-service.js';
import type { Project, ProjectFilter } from '$lib/types/index.js';

describe('ProjectService', () => {
	let projectService: ProjectService;

	beforeEach(() => {
		projectService = new ProjectService();
	});

	const validProject: Partial<Project> = {
		name: 'Test Project',
		clientName: 'Test Client',
		defaultBillingRate: 100,
		colorCode: '#3B82F6',
		status: 'active',
		budget: 5000,
		currency: 'USD',
		estimatedHours: 40
	};

	describe('Project Validation', () => {
		it('should validate a correct project', () => {
			const result = projectService.validateProject(validProject);
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should require project name', () => {
			const invalidProject = { ...validProject, name: '' };
			const result = projectService.validateProject(invalidProject);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Project name is required');
		});

		it('should require client name', () => {
			const invalidProject = { ...validProject, clientName: '' };
			const result = projectService.validateProject(invalidProject);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Client name is required');
		});

		it('should validate billing rate', () => {
			const invalidProject = { ...validProject, defaultBillingRate: -10 };
			const result = projectService.validateProject(invalidProject);
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('billing rate'))).toBe(true);
		});

		it('should validate color code format', () => {
			const invalidProject = { ...validProject, colorCode: 'invalid-color' };
			const result = projectService.validateProject(invalidProject);
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('color'))).toBe(true);
		});

		it('should validate date ranges', () => {
			const invalidProject = {
				...validProject,
				startDate: '2024-12-31',
				endDate: '2024-01-01'
			};
			const result = projectService.validateProject(invalidProject);
			expect(result.isValid).toBe(false);
			expect(result.errors.some(e => e.includes('date'))).toBe(true);
		});

		it('should provide warnings for missing estimated hours', () => {
			const projectWithoutHours = { ...validProject, estimatedHours: undefined };
			const result = projectService.validateProject(projectWithoutHours);
			expect(result.isValid).toBe(true);
			expect(result.warnings.some(w => w.includes('Estimated hours'))).toBe(true);
		});
	});

	describe('Project Filtering', () => {
		const mockProjects: Project[] = [
			{
				id: '1',
				name: 'Project A',
				clientName: 'Client 1',
				defaultBillingRate: 100,
				colorCode: '#3B82F6',
				status: 'active',
				actualHours: 0,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
				tags: ['web', 'frontend'],
				isBillable: true,
				isArchived: false
			},
			{
				id: '2',
				name: 'Project B',
				clientName: 'Client 2',
				defaultBillingRate: 150,
				colorCode: '#10B981',
				status: 'completed',
				actualHours: 0,
				createdAt: '2024-01-02T00:00:00Z',
				updatedAt: '2024-01-02T00:00:00Z',
				tags: ['mobile', 'backend'],
				isBillable: false,
				isArchived: true
			}
		];

		it('should filter by status', () => {
			const filter: ProjectFilter = { status: ['active'] };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].status).toBe('active');
		});

		it('should filter by client name', () => {
			const filter: ProjectFilter = { clientName: 'Client 1' };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].clientName).toBe('Client 1');
		});

		it('should filter by tags', () => {
			const filter: ProjectFilter = { tags: ['web'] };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].tags).toContain('web');
		});

		it('should filter by billable status', () => {
			const filter: ProjectFilter = { isBillable: true };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].isBillable).toBe(true);
		});

		it('should filter by archived status', () => {
			const filter: ProjectFilter = { isArchived: false };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].isArchived).toBe(false);
		});

		it('should search across multiple fields', () => {
			const filter: ProjectFilter = { search: 'Project A' };
			const filtered = projectService.filterProjects(mockProjects, filter);
			expect(filtered).toHaveLength(1);
			expect(filtered[0].name).toBe('Project A');
		});
	});

	describe('Project Sorting', () => {
		const mockProjects: Project[] = [
			{
				id: '1',
				name: 'B Project',
				clientName: 'Z Client',
				defaultBillingRate: 100,
				colorCode: '#3B82F6',
				status: 'active',
				actualHours: 0,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-03T00:00:00Z',
				tags: [],
				isBillable: true,
				isArchived: false
			},
			{
				id: '2',
				name: 'A Project',
				clientName: 'A Client',
				defaultBillingRate: 150,
				colorCode: '#10B981',
				status: 'completed',
				actualHours: 0,
				createdAt: '2024-01-02T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
				tags: [],
				isBillable: true,
				isArchived: false
			}
		];

		it('should sort by name', () => {
			const sorted = projectService.sortProjects(mockProjects, 'name', 'asc');
			expect(sorted[0].name).toBe('A Project');
			expect(sorted[1].name).toBe('B Project');
		});

		it('should sort by client', () => {
			const sorted = projectService.sortProjects(mockProjects, 'client', 'asc');
			expect(sorted[0].clientName).toBe('A Client');
			expect(sorted[1].clientName).toBe('Z Client');
		});

		it('should sort by created date', () => {
			const sorted = projectService.sortProjects(mockProjects, 'created', 'asc');
			expect(sorted[0].createdAt).toBe('2024-01-01T00:00:00Z');
			expect(sorted[1].createdAt).toBe('2024-01-02T00:00:00Z');
		});

		it('should sort by updated date', () => {
			const sorted = projectService.sortProjects(mockProjects, 'updated', 'desc');
			expect(sorted[0].updatedAt).toBe('2024-01-03T00:00:00Z');
			expect(sorted[1].updatedAt).toBe('2024-01-01T00:00:00Z');
		});
	});

	describe('Utility Methods', () => {
		it('should provide project color palette', () => {
			const colors = projectService.getProjectColorPalette();
			expect(colors).toBeInstanceOf(Array);
			expect(colors.length).toBeGreaterThan(0);
			expect(colors[0]).toMatch(/^#[0-9A-F]{6}$/i);
		});

		it('should generate default project data', () => {
			const defaultProject = projectService.generateDefaultProject();
			expect(defaultProject.name).toBe('');
			expect(defaultProject.clientName).toBe('');
			expect(defaultProject.status).toBe('active');
			expect(defaultProject.defaultBillingRate).toBe(75);
			expect(defaultProject.isBillable).toBe(true);
			expect(defaultProject.isArchived).toBe(false);
		});

		it('should allow overriding default project data', () => {
			const overrides = { name: 'Custom Project', defaultBillingRate: 200 };
			const defaultProject = projectService.generateDefaultProject(overrides);
			expect(defaultProject.name).toBe('Custom Project');
			expect(defaultProject.defaultBillingRate).toBe(200);
		});
	});

	describe('Metrics Calculation', () => {
		const mockProjects: Project[] = [
			{
				id: '1',
				name: 'Project 1',
				clientName: 'Client 1',
				defaultBillingRate: 100,
				colorCode: '#3B82F6',
				status: 'active',
				actualHours: 0,
				createdAt: '2024-01-01T00:00:00Z',
				updatedAt: '2024-01-01T00:00:00Z',
				startDate: '2024-01-01',
				endDate: '2024-01-10',
				tags: [],
				isBillable: true,
				isArchived: false
			},
			{
				id: '2',
				name: 'Project 2',
				clientName: 'Client 2',
				defaultBillingRate: 150,
				colorCode: '#10B981',
				status: 'completed',
				actualHours: 0,
				createdAt: '2024-01-02T00:00:00Z',
				updatedAt: '2024-01-02T00:00:00Z',
				startDate: '2024-01-02',
				endDate: '2024-01-12',
				tags: [],
				isBillable: true,
				isArchived: false
			}
		];

		it('should calculate overall metrics', () => {
			const metrics = projectService.calculateOverallMetrics(mockProjects, [], []);
			expect(metrics.totalProjects).toBe(2);
			expect(metrics.activeProjects).toBe(1);
			expect(metrics.completedProjects).toBe(1);
			expect(metrics.totalRevenue).toBe(0); // No time entries
			expect(metrics.averageProjectDuration).toBe(10); // Both projects are 10 days
		});
	});
});

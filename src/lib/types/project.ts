/**
 * Project-related TypeScript interfaces for TimeFlow Pro
 *
 * These interfaces define the structure for:
 * - Project management
 * - Client information
 * - Project settings and configuration
 */

export interface Project {
	/** Unique project identifier */
	id: string;

	/** Project name */
	name: string;

	/** Client name */
	clientName: string;

	/** Project description */
	description?: string;

	/** Default billing rate per hour */
	defaultBillingRate: number;

	/** Project color code for UI */
	colorCode: string;

	/** Project status */
	status: ProjectStatus;

	/** Estimated total hours for the project */
	estimatedHours?: number;

	/** Actual hours worked (calculated from time entries) */
	actualHours: number;

	/** Project budget */
	budget?: number;

	/** Currency code (USD, EUR, etc.) */
	currency: string;

	/** Project start date */
	startDate?: string; // ISO date string

	/** Project end date */
	endDate?: string; // ISO date string

	/** Project tags */
	tags: string[];

	/** Whether this project is billable */
	isBillable: boolean;

	/** Whether this project is archived */
	isArchived: boolean;

	/** When this project was created */
	createdAt: string; // ISO date string

	/** When this project was last updated */
	updatedAt: string; // ISO date string
}

export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'cancelled' | 'archived';

export interface ProjectSummary {
	/** Project information */
	project: Project;

	/** Total hours tracked */
	totalHours: number;

	/** Total billable amount */
	totalBillable: number;

	/** Number of time entries */
	entryCount: number;

	/** Number of tasks */
	taskCount: number;

	/** Number of completed tasks */
	completedTasks: number;

	/** Project progress percentage */
	progressPercentage: number;

	/** Last activity date */
	lastActivity?: string; // ISO date string
}

export interface Client {
	/** Unique client identifier */
	id: string;

	/** Client name */
	name: string;

	/** Client email */
	email?: string;

	/** Client phone */
	phone?: string;

	/** Client address */
	address?: string;

	/** Client company */
	company?: string;

	/** Default billing rate for this client */
	defaultBillingRate?: number;

	/** Default currency for this client */
	defaultCurrency: string;

	/** Client notes */
	notes?: string;

	/** Whether this client is active */
	isActive: boolean;

	/** When this client was created */
	createdAt: string; // ISO date string

	/** When this client was last updated */
	updatedAt: string; // ISO date string
}

export interface ProjectFilter {
	/** Filter by status */
	status?: ProjectStatus[];

	/** Filter by client */
	clientName?: string;

	/** Filter by tags */
	tags?: string[];

	/** Filter by date range */
	dateRange?: {
		start: string;
		end: string;
	};

	/** Filter by billable status */
	isBillable?: boolean;

	/** Filter by archived status */
	isArchived?: boolean;

	/** Search query */
	search?: string;
}

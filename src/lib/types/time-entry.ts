/**
 * Time Entry TypeScript interfaces for TimeFlow Pro
 *
 * These interfaces define the structure for:
 * - Time entry management
 * - Billing calculations
 * - Time tracking data
 */

export interface TimeEntry {
	/** Unique time entry identifier */
	id: string;

	/** Project this entry belongs to */
	projectId: string;

	/** Task this entry belongs to (optional) */
	taskId?: string;

	/** Date of the time entry (YYYY-MM-DD format) */
	date: string;

	/** Start time (ISO string) */
	startTime: string;

	/** End time (ISO string) */
	endTime: string;

	/** Duration in hours (decimal) */
	duration: number;

	/** Entry description */
	description: string;

	/** Category of work */
	category: TimeEntryCategory;

	/** Hours actually tracked */
	trackedHours: number;

	/** Billable hours (can differ from tracked) */
	billableHours: number;

	/** Custom billing rate (overrides project rate) */
	billingRate?: number;

	/** Billing status */
	billingStatus: BillingStatus;

	/** Invoice ID when billed */
	invoiceId?: string;

	/** Entry tags */
	tags: string[];

	/** Whether this entry was created from timer */
	fromTimer: boolean;

	/** Whether this entry has been edited */
	isEdited: boolean;

	/** Original duration before edits */
	originalDuration?: number;

	/** Entry notes */
	notes?: string;

	/** When this entry was created */
	createdAt: string; // ISO date string

	/** When this entry was last updated */
	updatedAt: string; // ISO date string
}

export type TimeEntryCategory =
	| 'development'
	| 'design'
	| 'review'
	| 'meeting'
	| 'research'
	| 'testing'
	| 'documentation'
	| 'planning'
	| 'bug-fix'
	| 'maintenance'
	| 'other';

export type BillingStatus = 'ready' | 'billed' | 'paid' | 'non-billable';

export interface TimeEntryFilter {
	/** Filter by project */
	projectId?: string;

	/** Filter by task */
	taskId?: string;

	/** Filter by date range */
	dateRange?: {
		start: string;
		end: string;
	};

	/** Filter by category */
	category?: TimeEntryCategory[];

	/** Filter by billing status */
	billingStatus?: BillingStatus[];

	/** Filter by tags */
	tags?: string[];

	/** Filter by billable status */
	isBillable?: boolean;

	/** Filter by timer source */
	fromTimer?: boolean;

	/** Minimum duration filter */
	minDuration?: number;

	/** Maximum duration filter */
	maxDuration?: number;

	/** Search query */
	search?: string;
}

export interface TimeEntrySummary {
	/** Total entries */
	totalEntries: number;

	/** Total tracked hours */
	totalTrackedHours: number;

	/** Total billable hours */
	totalBillableHours: number;

	/** Total billable amount */
	totalBillableAmount: number;

	/** Average hours per day */
	averageHoursPerDay: number;

	/** Most productive day */
	mostProductiveDay?: string;

	/** Most common category */
	mostCommonCategory?: TimeEntryCategory;

	/** Entries by status */
	entriesByStatus: Record<BillingStatus, number>;

	/** Entries by category */
	entriesByCategory: Record<TimeEntryCategory, number>;
}

export interface DailyTimeEntry {
	/** Date (YYYY-MM-DD) */
	date: string;

	/** Time entries for this day */
	entries: TimeEntry[];

	/** Total hours for the day */
	totalHours: number;

	/** Total billable hours for the day */
	totalBillableHours: number;

	/** Total billable amount for the day */
	totalBillableAmount: number;

	/** Whether this day has any running timers */
	hasActiveTimer: boolean;
}

export interface TimeEntryValidation {
	/** Whether the entry is valid */
	isValid: boolean;

	/** Validation errors */
	errors: string[];

	/** Validation warnings */
	warnings: string[];

	/** Suggested fixes */
	suggestions: string[];
}

export interface BulkTimeEntryOperation {
	/** Operation type */
	operation: 'update' | 'delete' | 'move' | 'bill';

	/** Entry IDs to operate on */
	entryIds: string[];

	/** Operation parameters */
	parameters?: Record<string, unknown>;

	/** Whether to confirm before executing */
	requireConfirmation: boolean;
}

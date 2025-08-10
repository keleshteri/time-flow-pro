/**
 * Task-related TypeScript interfaces for TimeFlow Pro
 *
 * These interfaces define the structure for:
 * - Task management
 * - Task progress tracking
 * - Asana integration
 */

export interface Task {
	/** Unique task identifier */
	id: string;

	/** Project this task belongs to */
	projectId: string;

	/** Task title */
	title: string;

	/** Task description */
	description?: string;

	/** Estimated hours for completion */
	estimatedHours?: number;

	/** Actual hours worked (calculated from time entries) */
	actualHours: number;

	/** Task priority level */
	priority: TaskPriority;

	/** Task status */
	status: TaskStatus;

	/** Asana task ID for integration */
	asanaTaskId?: string;

	/** Task tags */
	tags: string[];

	/** Task due date */
	dueDate?: string; // ISO date string

	/** Task assignee */
	assignee?: string;

	/** Task completion percentage */
	completionPercentage: number;

	/** Whether this task is billable */
	isBillable: boolean;

	/** Custom billing rate for this task */
	customBillingRate?: number;

	/** Task dependencies (other task IDs) */
	dependencies: string[];

	/** Subtasks */
	subtasks: string[];

	/** Task notes */
	notes?: string;

	/** When this task was created */
	createdAt: string; // ISO date string

	/** When this task was last updated */
	updatedAt: string; // ISO date string

	/** When this task was completed */
	completedAt?: string; // ISO date string
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';

export interface TaskSummary {
	/** Task information */
	task: Task;

	/** Total time tracked */
	totalTime: number;

	/** Total billable amount */
	totalBillable: number;

	/** Number of time entries */
	entryCount: number;

	/** Progress percentage */
	progressPercentage: number;

	/** Whether task is overdue */
	isOverdue: boolean;

	/** Days until due date */
	daysUntilDue?: number;

	/** Last activity date */
	lastActivity?: string; // ISO date string
}

export interface TaskFilter {
	/** Filter by project */
	projectId?: string;

	/** Filter by status */
	status?: TaskStatus[];

	/** Filter by priority */
	priority?: TaskPriority[];

	/** Filter by assignee */
	assignee?: string;

	/** Filter by tags */
	tags?: string[];

	/** Filter by due date range */
	dueDateRange?: {
		start: string;
		end: string;
	};

	/** Filter by billable status */
	isBillable?: boolean;

	/** Filter by completion status */
	isCompleted?: boolean;

	/** Filter by overdue status */
	isOverdue?: boolean;

	/** Search query */
	search?: string;
}

export interface TaskProgress {
	/** Task ID */
	taskId: string;

	/** Completion percentage */
	percentage: number;

	/** Hours worked */
	hoursWorked: number;

	/** Hours remaining (estimated) */
	hoursRemaining: number;

	/** Whether task is on track */
	isOnTrack: boolean;

	/** Progress notes */
	notes?: string;

	/** Last updated */
	updatedAt: string; // ISO date string
}

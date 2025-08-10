<!--
	TimeFlow Pro Task Card Component
	
	Individual task display with status indicators, progress bar based on estimated vs actual hours,
	priority and due date visualization, and quick edit capabilities.
	
	@component
	@example
	```svelte
	<TaskCard 
		{task}
		{summary}
		{project}
		on:edit={() => showEditForm = true}
		on:complete={() => completeTask(task.id)}
		on:start={() => startTask(task.id)}
		on:startTimer={() => startTimerForTask(task.id)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Task, TaskSummary, Project } from '$lib/types/index.js';
	import { Button, Card } from '$lib/components/ui';
	import { 
		formatProgress, 
		getProgressColorClass,
		getPriorityColorClass,
		getStatusColorClass,
		getDaysUntilDue,
		isTaskOverdue
	} from '$lib/utils/progress-utils.js';
	import { formatTimerCompact } from '$lib/utils/time-utils.js';

	// Props
	export let task: Task;
	export let summary: TaskSummary;
	export let project: Project | undefined = undefined;
	export let showActions: boolean = true;
	export let compact: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		edit: { task: Task };
		delete: { task: Task };
		complete: { task: Task };
		start: { task: Task };
		pause: { task: Task };
		cancel: { task: Task };
		startTimer: { task: Task };
		viewDetails: { task: Task };
	}>();

	// Computed values
	$: progressPercentage = summary.progressPercentage;
	$: progressColor = getProgressColorClass(progressPercentage, summary.isOverdue);
	$: priorityClass = getPriorityColorClass(task.priority);
	$: statusClass = getStatusColorClass(task.status);
	$: daysUntilDue = getDaysUntilDue(task);
	$: isOverdue = isTaskOverdue(task);
	$: isCompleted = task.status === 'completed';
	$: canStart = task.status === 'pending' || task.status === 'on-hold';
	$: canComplete = task.status === 'in-progress' || task.status === 'pending';

	// Event handlers
	function handleEdit() {
		dispatch('edit', { task });
	}

	function handleDelete() {
		dispatch('delete', { task });
	}

	function handleComplete() {
		dispatch('complete', { task });
	}

	function handleStart() {
		dispatch('start', { task });
	}

	function handlePause() {
		dispatch('pause', { task });
	}

	function handleCancel() {
		dispatch('cancel', { task });
	}

	function handleStartTimer() {
		dispatch('startTimer', { task });
	}

	function handleViewDetails() {
		dispatch('viewDetails', { task });
	}

	// Format due date
	function formatDueDate(dueDate: string): string {
		const date = new Date(dueDate);
		const now = new Date();
		const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Due today';
		if (diffDays === 1) return 'Due tomorrow';
		if (diffDays === -1) return 'Due yesterday';
		if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
		if (diffDays <= 7) return `Due in ${diffDays} days`;
		
		return date.toLocaleDateString();
	}

	// Format currency
	function formatCurrency(amount: number): string {
		const currency = project?.currency || 'USD';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(amount);
	}
</script>

<Card class="task-card {compact ? 'p-4' : 'p-5'} hover:shadow-md transition-shadow duration-200">
	<!-- Task Header -->
	<div class="flex items-start justify-between mb-3">
		<div class="flex-1 min-w-0">
			<!-- Task Title -->
			<h4 class="text-base font-semibold text-gray-900 truncate mb-1">
				{task.title}
			</h4>
			
			<!-- Priority and Status Badges -->
			<div class="flex items-center gap-2 mb-2">
				<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border {priorityClass}">
					{task.priority.toUpperCase()}
				</span>
				<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border {statusClass}">
					{task.status.replace('-', ' ').toUpperCase()}
				</span>
			</div>
		</div>

		<!-- Quick Actions -->
		{#if showActions}
			<div class="flex items-center gap-1 ml-3">
				<Button
					variant="ghost"
					size="sm"
					onclick={handleStartTimer}
					aria-label="Start timer for {task.title}"
					class="text-green-600 hover:text-green-700"
				>
					▶️
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={handleEdit}
					aria-label="Edit {task.title}"
				>
					✏️
				</Button>
			</div>
		{/if}
	</div>

	<!-- Task Description -->
	{#if task.description && !compact}
		<p class="text-sm text-gray-600 mb-3 line-clamp-2">
			{task.description}
		</p>
	{/if}

	<!-- Progress Section -->
	<div class="mb-3">
		<!-- Progress Bar -->
		<div class="flex items-center justify-between mb-1">
			<span class="text-xs font-medium text-gray-700">Progress</span>
			<span class="text-xs text-gray-600">{formatProgress(progressPercentage)}</span>
		</div>
		<div class="w-full bg-gray-200 rounded-full h-1.5">
			<div 
				class="h-1.5 rounded-full transition-all duration-300 {progressColor}"
				style="width: {Math.min(progressPercentage, 100)}%"
				role="progressbar"
				aria-valuenow={progressPercentage}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label="Task progress: {formatProgress(progressPercentage)}"
			></div>
		</div>
	</div>

	<!-- Task Metrics -->
	<div class="grid grid-cols-2 gap-3 mb-3 text-center">
		<!-- Time Tracked -->
		<div>
			<div class="text-sm font-semibold text-gray-900">
				{formatTimerCompact(summary.totalTime * 3600)}
			</div>
			<div class="text-xs text-gray-500">Tracked</div>
		</div>

		<!-- Estimated vs Actual -->
		<div>
			{#if task.estimatedHours}
				<div class="text-sm font-semibold {summary.totalTime > task.estimatedHours ? 'text-red-600' : 'text-gray-900'}">
					{task.estimatedHours}h est.
				</div>
				<div class="text-xs text-gray-500">
					{summary.totalTime > task.estimatedHours ? 'Over' : 'Under'} by {Math.abs(summary.totalTime - task.estimatedHours).toFixed(1)}h
				</div>
			{:else}
				<div class="text-sm font-semibold text-gray-900">
					{formatCurrency(summary.totalBillable)}
				</div>
				<div class="text-xs text-gray-500">Revenue</div>
			{/if}
		</div>
	</div>

	<!-- Due Date Warning -->
	{#if task.dueDate}
		<div class="mb-3">
			<div class="text-xs {isOverdue ? 'text-red-600 font-medium' : daysUntilDue !== null && daysUntilDue <= 3 ? 'text-yellow-600 font-medium' : 'text-gray-500'}">
				{#if isOverdue}
					⚠️ {formatDueDate(task.dueDate)}
				{:else}
					📅 {formatDueDate(task.dueDate)}
				{/if}
			</div>
		</div>
	{/if}

	<!-- Task Tags -->
	{#if task.tags.length > 0 && !compact}
		<div class="mb-3">
			<div class="flex flex-wrap gap-1">
				{#each task.tags.slice(0, 3) as tag}
					<span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
						{tag}
					</span>
				{/each}
				{#if task.tags.length > 3}
					<span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
						+{task.tags.length - 3} more
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Action Buttons -->
	{#if showActions && !compact}
		<div class="flex items-center justify-between pt-3 border-t border-gray-200">
			<div class="flex items-center gap-2">
				{#if canStart}
					<Button
						variant="primary"
						size="sm"
						onclick={handleStart}
					>
						Start Task
					</Button>
				{:else if task.status === 'in-progress'}
					<Button
						variant="secondary"
						size="sm"
						onclick={handlePause}
					>
						Pause
					</Button>
				{/if}
				
				{#if canComplete && !isCompleted}
					<Button
						variant="success"
						size="sm"
						onclick={handleComplete}
					>
						Complete
					</Button>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onclick={handleViewDetails}
					aria-label="View task details"
				>
					Details
				</Button>
			</div>
		</div>
	{/if}

	<!-- Assignee -->
	{#if task.assignee && !compact}
		<div class="mt-3 pt-3 border-t border-gray-100">
			<p class="text-xs text-gray-500">
				Assigned to: <span class="font-medium">{task.assignee}</span>
			</p>
		</div>
	{/if}
</Card>

<style>
	.task-card {
		transition: transform 0.2s ease-in-out;
	}
	
	.task-card:hover {
		transform: translateY(-1px);
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

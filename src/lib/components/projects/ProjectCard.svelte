<!--
	TimeFlow Pro Project Card Component
	
	Display project summary with progress indicators, total hours, active tasks,
	revenue calculations, and quick actions (edit, archive, view details).
	Responsive design with consistent styling.
	
	@component
	@example
	```svelte
	<ProjectCard 
		{project}
		{summary}
		on:edit={() => showEditForm = true}
		on:archive={() => archiveProject(project.id)}
		on:viewTasks={() => navigateToTasks(project.id)}
		on:startTimer={() => startTimerForProject(project.id)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Project, ProjectSummary } from '$lib/types/index.js';
	import { Button, Card } from '$lib/components/ui';
	import { formatProgress, getProgressColorClass } from '$lib/utils/progress-utils.js';
	import { formatDuration } from '$lib/utils/time-utils.js';

	// Props
	export let project: Project;
	export let summary: ProjectSummary;
	export let showActions: boolean = true;
	export let compact: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		edit: { project: Project };
		archive: { project: Project };
		unarchive: { project: Project };
		delete: { project: Project };
		viewTasks: { project: Project };
		startTimer: { project: Project };
		viewDetails: { project: Project };
	}>();

	// Computed values
	$: progressPercentage = summary.progressPercentage;
	$: progressColor = getProgressColorClass(progressPercentage);
	$: isOverBudget = project.budget && summary.totalBillable > project.budget;
	$: completionRate = summary.taskCount > 0 ? (summary.completedTasks / summary.taskCount) * 100 : 0;

	// Event handlers
	function handleEdit() {
		dispatch('edit', { project });
	}

	function handleArchive() {
		if (project.isArchived) {
			dispatch('unarchive', { project });
		} else {
			dispatch('archive', { project });
		}
	}

	function handleDelete() {
		dispatch('delete', { project });
	}

	function handleViewTasks() {
		dispatch('viewTasks', { project });
	}

	function handleStartTimer() {
		dispatch('startTimer', { project });
	}

	function handleViewDetails() {
		dispatch('viewDetails', { project });
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: project.currency || 'USD'
		}).format(amount);
	}

	// Get status badge classes
	function getStatusBadgeClass(status: Project['status']): string {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'completed':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'on-hold':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'archived':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}
</script>

<Card class="project-card {compact ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow duration-200">
	<!-- Project Header -->
	<div class="flex items-start justify-between mb-4">
		<div class="flex-1 min-w-0">
			<!-- Project Color Indicator -->
			<div class="flex items-center gap-3 mb-2">
				<div 
					class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
					style="background-color: {project.colorCode}"
					aria-hidden="true"
				></div>
				<h3 class="text-lg font-semibold text-gray-900 truncate">
					{project.name}
				</h3>
			</div>
			
			<!-- Client Name -->
			<p class="text-sm text-gray-600 mb-1">
				Client: <span class="font-medium">{project.clientName}</span>
			</p>
			
			<!-- Status Badge -->
			<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusBadgeClass(project.status)}">
				{project.status.charAt(0).toUpperCase() + project.status.slice(1)}
			</span>
		</div>

		<!-- Quick Actions -->
		{#if showActions}
			<div class="flex items-center gap-2 ml-4">
				<Button
					variant="ghost"
					size="sm"
					onclick={handleStartTimer}
					aria-label="Start timer for {project.name}"
					class="text-green-600 hover:text-green-700"
				>
					▶️
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={handleEdit}
					aria-label="Edit {project.name}"
				>
					✏️
				</Button>
				{#if !compact}
					<Button
						variant="ghost"
						size="sm"
						onclick={handleArchive}
						aria-label="{project.isArchived ? 'Unarchive' : 'Archive'} {project.name}"
						class="text-gray-500 hover:text-gray-700"
					>
						{project.isArchived ? '📤' : '📥'}
					</Button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Project Description -->
	{#if project.description && !compact}
		<p class="text-sm text-gray-600 mb-4 line-clamp-2">
			{project.description}
		</p>
	{/if}

	<!-- Progress Section -->
	<div class="mb-4">
		<!-- Progress Bar -->
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">Progress</span>
			<span class="text-sm text-gray-600">{formatProgress(progressPercentage)}</span>
		</div>
		<div class="w-full bg-gray-200 rounded-full h-2">
			<div 
				class="h-2 rounded-full transition-all duration-300 {progressColor}"
				style="width: {Math.min(progressPercentage, 100)}%"
				role="progressbar"
				aria-valuenow={progressPercentage}
				aria-valuemin="0"
				aria-valuemax="100"
				aria-label="Project progress: {formatProgress(progressPercentage)}"
			></div>
		</div>
	</div>

	<!-- Project Metrics -->
	<div class="grid grid-cols-2 {compact ? 'gap-3' : 'gap-4'} mb-4">
		<!-- Total Hours -->
		<div class="text-center">
			<div class="text-lg font-semibold text-gray-900">
				{formatDuration(summary.totalHours * 3600, 'short')}
			</div>
			<div class="text-xs text-gray-500">Total Hours</div>
		</div>

		<!-- Revenue -->
		<div class="text-center">
			<div class="text-lg font-semibold {isOverBudget ? 'text-red-600' : 'text-green-600'}">
				{formatCurrency(summary.totalBillable)}
			</div>
			<div class="text-xs text-gray-500">Revenue</div>
		</div>

		<!-- Tasks -->
		{#if !compact}
			<div class="text-center">
				<div class="text-lg font-semibold text-gray-900">
					{summary.completedTasks}/{summary.taskCount}
				</div>
				<div class="text-xs text-gray-500">Tasks Done</div>
			</div>

			<!-- Entries -->
			<div class="text-center">
				<div class="text-lg font-semibold text-gray-900">
					{summary.entryCount}
				</div>
				<div class="text-xs text-gray-500">Time Entries</div>
			</div>
		{/if}
	</div>

	<!-- Budget Warning -->
	{#if isOverBudget && project.budget}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
			<div class="flex items-center">
				<span class="text-red-600 text-sm font-medium">
					⚠️ Over budget by {formatCurrency(summary.totalBillable - project.budget)}
				</span>
			</div>
		</div>
	{/if}

	<!-- Action Buttons -->
	{#if showActions && !compact}
		<div class="flex items-center justify-between pt-4 border-t border-gray-200">
			<div class="flex items-center gap-2">
				<Button
					variant="primary"
					size="sm"
					onclick={handleViewTasks}
				>
					View Tasks ({summary.taskCount})
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onclick={handleViewDetails}
				>
					Details
				</Button>
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onclick={handleEdit}
					aria-label="Edit project"
				>
					Edit
				</Button>
				{#if !project.isArchived}
					<Button
						variant="ghost"
						size="sm"
						onclick={handleArchive}
						aria-label="Archive project"
						class="text-gray-500 hover:text-gray-700"
					>
						Archive
					</Button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Last Activity -->
	{#if summary.lastActivity && !compact}
		<div class="mt-3 pt-3 border-t border-gray-100">
			<p class="text-xs text-gray-500">
				Last activity: {new Date(summary.lastActivity).toLocaleDateString()}
			</p>
		</div>
	{/if}
</Card>

<style>
	.project-card {
		transition: transform 0.2s ease-in-out;
	}
	
	.project-card:hover {
		transform: translateY(-1px);
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>

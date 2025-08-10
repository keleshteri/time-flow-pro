<!--
	TimeFlow Pro Task List Component
	
	Task list with project grouping, filtering by status, priority, project,
	drag-and-drop reordering (basic), and integration with time entry creation.
	
	@component
	@example
	```svelte
	<TaskList 
		{tasks}
		{summaries}
		{projects}
		groupBy="project"
		on:taskEdit={(event) => editTask(event.detail.task)}
		on:taskStartTimer={(event) => startTimer(event.detail.task)}
		on:createTimeEntry={(event) => createTimeEntry(event.detail)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Task, TaskSummary, Project, TaskFilter } from '$lib/types/index.js';
	import { Button, Input, Card } from '$lib/components/ui';
	import TaskCard from './TaskCard.svelte';
	import { TaskService } from '$lib/services/task-service.js';
	import { isTaskOverdue } from '$lib/utils/progress-utils.js';

	// Props
	export let tasks: Task[] = [];
	export let summaries: TaskSummary[] = [];
	export let projects: Project[] = [];
	export let groupBy: 'none' | 'project' | 'status' | 'priority' = 'none';
	export let showSearch: boolean = true;
	export let showFilters: boolean = true;
	export let showBulkActions: boolean = true;
	export let compact: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		taskEdit: { task: Task };
		taskDelete: { task: Task };
		taskComplete: { task: Task };
		taskStart: { task: Task };
		taskPause: { task: Task };
		taskCancel: { task: Task };
		taskStartTimer: { task: Task };
		taskViewDetails: { task: Task };
		createTimeEntry: { task: Task; project?: Project };
		bulkComplete: { taskIds: string[] };
		bulkDelete: { taskIds: string[] };
	}>();

	// Local state
	let searchQuery = '';
	let selectedStatus: Task['status'] | 'all' = 'all';
	let selectedPriority: Task['priority'] | 'all' = 'all';
	let selectedProjectId = '';
	let sortBy: 'title' | 'priority' | 'status' | 'dueDate' | 'created' | 'progress' = 'dueDate';
	let sortDirection: 'asc' | 'desc' = 'asc';
	let selectedTaskIds: Set<string> = new Set();
	let showCompleted = false;

	// Task service instance
	const taskService = new TaskService();

	// Computed values
	$: filter = {
		projectId: selectedProjectId || undefined,
		status: selectedStatus === 'all' ? undefined : [selectedStatus],
		priority: selectedPriority === 'all' ? undefined : [selectedPriority],
		search: searchQuery || undefined,
		isCompleted: showCompleted ? undefined : false
	} as TaskFilter;

	$: filteredTasks = taskService.filterTasks(tasks, filter);
	$: sortedTasks = taskService.sortTasks(filteredTasks, sortBy, sortDirection);
	$: hasSelection = selectedTaskIds.size > 0;

	// Get summary for a task
	function getSummaryForTask(task: Task): TaskSummary {
		const found = summaries.find(s => s.task.id === task.id);
		if (found) return found;

		// Create default summary without optional properties
		const defaultSummary: TaskSummary = {
			task,
			totalTime: 0,
			totalBillable: 0,
			entryCount: 0,
			progressPercentage: 0,
			isOverdue: false
		};

		return defaultSummary;
	}

	// Get project for a task
	function getProjectForTask(task: Task): Project | undefined {
		return projects.find(p => p.id === task.projectId);
	}

	// Group tasks based on groupBy setting
	$: groupedTasks = (() => {
		if (groupBy === 'none') {
			return [{ key: 'all', label: 'All Tasks', tasks: sortedTasks }];
		}

		const groups = new Map<string, Task[]>();

		sortedTasks.forEach(task => {
			let groupKey: string;
			let groupLabel: string;

			switch (groupBy) {
				case 'project':
					const project = getProjectForTask(task);
					groupKey = task.projectId;
					groupLabel = project ? `${project.name} (${project.clientName})` : 'Unknown Project';
					break;
				case 'status':
					groupKey = task.status;
					groupLabel = task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ');
					break;
				case 'priority':
					groupKey = task.priority;
					groupLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
					break;
				default:
					groupKey = 'all';
					groupLabel = 'All Tasks';
			}

			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey)!.push(task);
		});

		return Array.from(groups.entries()).map(([key, tasks]) => ({
			key,
			label: groupBy === 'project' 
				? projects.find(p => p.id === key)?.name || 'Unknown Project'
				: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
			tasks
		}));
	})();

	// Selection handlers
	function toggleTaskSelection(taskId: string) {
		if (selectedTaskIds.has(taskId)) {
			selectedTaskIds.delete(taskId);
		} else {
			selectedTaskIds.add(taskId);
		}
		selectedTaskIds = new Set(selectedTaskIds);
	}

	function selectAllVisible() {
		sortedTasks.forEach(task => {
			selectedTaskIds.add(task.id);
		});
		selectedTaskIds = new Set(selectedTaskIds);
	}

	function clearSelection() {
		selectedTaskIds.clear();
		selectedTaskIds = new Set(selectedTaskIds);
	}

	// Bulk action handlers
	function handleBulkComplete() {
		dispatch('bulkComplete', { taskIds: Array.from(selectedTaskIds) });
		clearSelection();
	}

	function handleBulkDelete() {
		if (confirm(`Are you sure you want to delete ${selectedTaskIds.size} tasks? This action cannot be undone.`)) {
			dispatch('bulkDelete', { taskIds: Array.from(selectedTaskIds) });
			clearSelection();
		}
	}

	// Task event handlers
	function handleTaskStartTimer(event: CustomEvent<{ task: Task }>) {
		const task = event.detail.task;
		const project = getProjectForTask(task);
		if (project) {
			dispatch('createTimeEntry', { task, project });
		} else {
			dispatch('createTimeEntry', { task });
		}
	}
</script>

<!-- Search and Filters -->
{#if showSearch || showFilters}
	<Card class="mb-6 p-4">
		<div class="flex flex-col lg:flex-row gap-4">
			<!-- Search -->
			{#if showSearch}
				<div class="flex-1">
					<Input
						type="text"
						placeholder="Search tasks by title, description, or tags..."
						bind:value={searchQuery}
						class="w-full"
						aria-label="Search tasks"
					/>
				</div>
			{/if}

			<!-- Filters -->
			{#if showFilters}
				<div class="flex flex-col sm:flex-row gap-3">
					<!-- Project Filter -->
					<select 
						bind:value={selectedProjectId}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Filter by project"
					>
						<option value="">All Projects</option>
						{#each projects as project}
							<option value={project.id}>{project.name}</option>
						{/each}
					</select>

					<!-- Status Filter -->
					<select 
						bind:value={selectedStatus}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Filter by status"
					>
						<option value="all">All Status</option>
						<option value="pending">Pending</option>
						<option value="in-progress">In Progress</option>
						<option value="completed">Completed</option>
						<option value="on-hold">On Hold</option>
						<option value="cancelled">Cancelled</option>
					</select>

					<!-- Priority Filter -->
					<select 
						bind:value={selectedPriority}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Filter by priority"
					>
						<option value="all">All Priority</option>
						<option value="urgent">Urgent</option>
						<option value="high">High</option>
						<option value="medium">Medium</option>
						<option value="low">Low</option>
					</select>

					<!-- Sort Options -->
					<select 
						bind:value={sortBy}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Sort by"
					>
						<option value="dueDate">Due Date</option>
						<option value="priority">Priority</option>
						<option value="status">Status</option>
						<option value="title">Title</option>
						<option value="created">Created</option>
						<option value="progress">Progress</option>
					</select>

					<!-- Sort Direction -->
					<Button
						variant="ghost"
						size="sm"
						onclick={() => sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'}
						aria-label="Toggle sort direction"
						class="px-3"
					>
						{sortDirection === 'asc' ? '↑' : '↓'}
					</Button>

					<!-- Group By -->
					<select 
						bind:value={groupBy}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Group by"
					>
						<option value="none">No Grouping</option>
						<option value="project">By Project</option>
						<option value="status">By Status</option>
						<option value="priority">By Priority</option>
					</select>

					<!-- Show Completed Toggle -->
					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							bind:checked={showCompleted}
							class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
						Show Completed
					</label>
				</div>
			{/if}
		</div>
	</Card>
{/if}

<!-- Bulk Actions -->
{#if showBulkActions && hasSelection}
	<Card class="mb-4 p-4 bg-blue-50 border-blue-200">
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium text-blue-900">
				{selectedTaskIds.size} task{selectedTaskIds.size === 1 ? '' : 's'} selected
			</span>
			<div class="flex items-center gap-2">
				<Button
					variant="primary"
					size="sm"
					onclick={handleBulkComplete}
				>
					Complete Selected
				</Button>
				<Button
					variant="danger"
					size="sm"
					onclick={handleBulkDelete}
				>
					Delete Selected
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={clearSelection}
				>
					Clear Selection
				</Button>
			</div>
		</div>
	</Card>
{/if}

<!-- Task Groups -->
{#each groupedTasks as group (group.key)}
	{#if group.tasks.length > 0}
		<!-- Group Header -->
		{#if groupBy !== 'none'}
			<div class="mb-4">
				<h3 class="text-lg font-semibold text-gray-900 mb-3">
					{group.label} ({group.tasks.length})
				</h3>
			</div>
		{/if}

		<!-- Task Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
			{#each group.tasks as task (task.id)}
				<div class="relative">
					<!-- Selection Checkbox -->
					{#if showBulkActions}
						<label class="absolute top-2 left-2 z-10 flex items-center">
							<input
								type="checkbox"
								checked={selectedTaskIds.has(task.id)}
								onchange={() => toggleTaskSelection(task.id)}
								class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
								aria-label="Select {task.title}"
							/>
						</label>
					{/if}

					<!-- Task Card -->
					<TaskCard
						{task}
						summary={getSummaryForTask(task)}
						project={getProjectForTask(task)}
						{compact}
						on:edit={(event) => dispatch('taskEdit', event.detail)}
						on:delete={(event) => dispatch('taskDelete', event.detail)}
						on:complete={(event) => dispatch('taskComplete', event.detail)}
						on:start={(event) => dispatch('taskStart', event.detail)}
						on:pause={(event) => dispatch('taskPause', event.detail)}
						on:cancel={(event) => dispatch('taskCancel', event.detail)}
						on:startTimer={handleTaskStartTimer}
						on:viewDetails={(event) => dispatch('taskViewDetails', event.detail)}
					/>
				</div>
			{/each}
		</div>
	{/if}
{/each}

<!-- Empty State -->
{#if sortedTasks.length === 0}
	<Card class="p-8 text-center">
		<div class="text-gray-500 mb-4">
			{#if searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedProjectId}
				<h3 class="text-lg font-medium mb-2">No tasks match your filters</h3>
				<p>Try adjusting your search criteria or filters.</p>
			{:else}
				<h3 class="text-lg font-medium mb-2">No tasks yet</h3>
				<p>Create your first task to start organizing your work.</p>
			{/if}
		</div>
		<Button
			variant="primary"
			onclick={() => dispatch('taskEdit', { task: taskService.generateDefaultTask(selectedProjectId || '') })}
		>
			Create First Task
		</Button>
	</Card>
{/if}

<!-- Bulk Selection Actions -->
{#if showBulkActions && sortedTasks.length > 0}
	<div class="mt-4 flex items-center justify-between text-sm text-gray-600">
		<div class="flex items-center gap-4">
			<button
				type="button"
				onclick={selectAllVisible}
				class="text-primary-600 hover:text-primary-700 font-medium"
			>
				Select All Visible
			</button>
			{#if hasSelection}
				<button
					type="button"
					onclick={clearSelection}
					class="text-gray-500 hover:text-gray-700 font-medium"
				>
					Clear Selection
				</button>
			{/if}
		</div>
		
		<div>
			{selectedTaskIds.size} of {sortedTasks.length} selected
		</div>
	</div>
{/if}

<!-- Task Statistics -->
{#if sortedTasks.length > 0}
	<Card class="mt-6 p-4 bg-gray-50">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
			<div>
				<div class="text-lg font-semibold text-gray-900">
					{sortedTasks.filter(t => t.status === 'completed').length}
				</div>
				<div class="text-xs text-gray-500">Completed</div>
			</div>
			<div>
				<div class="text-lg font-semibold text-blue-600">
					{sortedTasks.filter(t => t.status === 'in-progress').length}
				</div>
				<div class="text-xs text-gray-500">In Progress</div>
			</div>
			<div>
				<div class="text-lg font-semibold text-yellow-600">
					{sortedTasks.filter(t => t.status === 'pending').length}
				</div>
				<div class="text-xs text-gray-500">Pending</div>
			</div>
			<div>
				<div class="text-lg font-semibold text-red-600">
					{sortedTasks.filter(t => isTaskOverdue(t)).length}
				</div>
				<div class="text-xs text-gray-500">Overdue</div>
			</div>
		</div>
	</Card>
{/if}

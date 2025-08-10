<!--
	TimeFlow Pro Task Form Component
	
	Create/edit task form with validation, project selection, priority and status settings,
	due date management, and integration with existing form validation patterns.
	
	@component
	@example
	```svelte
	<TaskForm 
		{task}
		{projects}
		on:saved={(event) => handleTaskSaved(event.detail)}
		on:cancelled={() => showForm = false}
		on:deleted={(event) => handleTaskDeleted(event.detail)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Task, Project } from '$lib/types/index.js';
	import { Button, Input, Card } from '$lib/components/ui';
	import { TaskService } from '$lib/services/task-service.js';

	// Props
	export let task: Partial<Task> | null = null;
	export let projects: Project[] = [];
	export let selectedProjectId: string = '';
	export let showDeleteButton: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		saved: { task: Task; isNew: boolean };
		cancelled: void;
		deleted: { taskId: string };
	}>();

	// Form state
	let formData: Partial<Task> = {};
	let errors: Record<string, string> = {};
	let warnings: Record<string, string> = {};
	let isSubmitting = false;
	let tagInput = '';

	// Task service instance
	const taskService = new TaskService();

	// Initialize form data
	$: if (task) {
		formData = { ...task };
	} else {
		formData = taskService.generateDefaultTask(selectedProjectId);
	}

	$: isEditing = !!(task && task.id);

	// Validation
	$: {
		const validation = taskService.validateTask(formData, projects);
		errors = {};
		warnings = {};
		
		validation.errors.forEach(error => {
			if (error.includes('title')) errors.title = error;
			else if (error.includes('project')) errors.projectId = error;
			else if (error.includes('estimated hours')) errors.estimatedHours = error;
			else if (error.includes('due date')) errors.dueDate = error;
			else if (error.includes('completion')) errors.completionPercentage = error;
			else if (error.includes('billing rate')) errors.customBillingRate = error;
		});

		validation.warnings.forEach(warning => {
			if (warning.includes('due date')) warnings.dueDate = warning;
		});
	}

	$: isValid = Object.keys(errors).length === 0;

	// Event handlers
	function handleSave() {
		if (!isValid || isSubmitting) return;

		isSubmitting = true;

		try {
			const taskToSave: Task = {
				...formData,
				id: formData.id || '',
				createdAt: formData.createdAt || '',
				updatedAt: formData.updatedAt || '',
				actualHours: formData.actualHours || 0,
				tags: formData.tags || []
			} as Task;

			dispatch('saved', { 
				task: taskToSave, 
				isNew: !isEditing 
			});
		} catch (error) {
			console.error('Failed to save task:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		dispatch('cancelled');
	}

	function handleDelete() {
		if (!task?.id) return;
		
		if (confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
			dispatch('deleted', { taskId: task.id });
		}
	}

	// Tag management
	function addTag() {
		if (!tagInput.trim()) return;
		
		const newTag = tagInput.trim();
		if (!formData.tags) formData.tags = [];
		
		if (!formData.tags.includes(newTag)) {
			formData.tags = [...formData.tags, newTag];
		}
		
		tagInput = '';
	}

	function removeTag(tagToRemove: string) {
		if (!formData.tags) return;
		formData.tags = formData.tags.filter(tag => tag !== tagToRemove);
	}

	function handleTagKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		}
	}

	// Get project name for display
	function getProjectName(projectId: string): string {
		const project = projects.find(p => p.id === projectId);
		return project ? `${project.name} (${project.clientName})` : 'Unknown Project';
	}
</script>

<Card class="p-6">
	<form onsubmit={(event) => { event.preventDefault(); handleSave(); }} class="space-y-6">
		<!-- Form Header -->
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900">
				{isEditing ? 'Edit Task' : 'Create New Task'}
			</h2>
		</div>

		<!-- Task Title -->
		<div>
			<label for="task-title" class="block text-sm font-medium text-gray-700 mb-2">
				Task Title *
			</label>
			<Input
				id="task-title"
				type="text"
				bind:value={formData.title}
				placeholder="Enter task title"
				error={errors.title}
				required
				class="w-full"
			/>
		</div>

		<!-- Project Selection -->
		<div>
			<label for="project-id" class="block text-sm font-medium text-gray-700 mb-2">
				Project *
			</label>
			<select
				id="project-id"
				bind:value={formData.projectId}
				required
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 {errors.projectId ? 'border-red-300' : ''}"
			>
				<option value="">Select a project</option>
				{#each projects.filter(p => !p.isArchived) as project}
					<option value={project.id}>{getProjectName(project.id)}</option>
				{/each}
			</select>
			{#if errors.projectId}
				<p class="mt-1 text-sm text-red-600">{errors.projectId}</p>
			{/if}
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
				Description
			</label>
			<textarea
				id="description"
				bind:value={formData.description}
				placeholder="Enter task description (optional)"
				rows="3"
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
			></textarea>
		</div>

		<!-- Priority and Status -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
					Priority
				</label>
				<select
					id="priority"
					bind:value={formData.priority}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
					<option value="urgent">Urgent</option>
				</select>
			</div>
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
					Status
				</label>
				<select
					id="status"
					bind:value={formData.status}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="pending">Pending</option>
					<option value="in-progress">In Progress</option>
					<option value="completed">Completed</option>
					<option value="on-hold">On Hold</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>
		</div>

		<!-- Estimated Hours and Due Date -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="estimated-hours" class="block text-sm font-medium text-gray-700 mb-2">
					Estimated Hours
				</label>
				<Input
					id="estimated-hours"
					type="number"
					bind:value={formData.estimatedHours}
					placeholder="8.0"
					min="0"
					step="0.5"
					error={errors.estimatedHours}
					class="w-full"
				/>
			</div>
			<div>
				<label for="due-date" class="block text-sm font-medium text-gray-700 mb-2">
					Due Date
				</label>
				<Input
					id="due-date"
					type="date"
					bind:value={formData.dueDate}
					error={errors.dueDate}
					class="w-full"
				/>
				{#if warnings.dueDate}
					<p class="mt-1 text-sm text-yellow-600">{warnings.dueDate}</p>
				{/if}
			</div>
		</div>

		<!-- Assignee and Custom Billing Rate -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="assignee" class="block text-sm font-medium text-gray-700 mb-2">
					Assignee
				</label>
				<Input
					id="assignee"
					type="text"
					bind:value={formData.assignee}
					placeholder="Enter assignee name"
					class="w-full"
				/>
			</div>
			<div>
				<label for="custom-billing-rate" class="block text-sm font-medium text-gray-700 mb-2">
					Custom Billing Rate
				</label>
				<Input
					id="custom-billing-rate"
					type="number"
					bind:value={formData.customBillingRate}
					placeholder="Override project rate"
					min="0"
					step="0.01"
					error={errors.customBillingRate}
					class="w-full"
				/>
			</div>
		</div>

		<!-- Tags -->
		<div>
			<label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
				Tags
			</label>
			<div class="space-y-2">
				<!-- Tag Input -->
				<div class="flex gap-2">
					<Input
						id="tags"
						type="text"
						bind:value={tagInput}
						placeholder="Add a tag"
						class="flex-1"
						on:keydown={handleTagKeydown}
					/>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onclick={addTag}
						disabled={!tagInput.trim()}
					>
						Add Tag
					</Button>
				</div>
				
				<!-- Existing Tags -->
				{#if formData.tags && formData.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each formData.tags as tag}
							<span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
								{tag}
								<button
									type="button"
									onclick={() => removeTag(tag)}
									class="text-gray-500 hover:text-gray-700"
									aria-label="Remove tag {tag}"
								>
									×
								</button>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Billable Toggle -->
		<div class="flex items-center">
			<input
				id="is-billable"
				type="checkbox"
				bind:checked={formData.isBillable}
				class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
			/>
			<label for="is-billable" class="ml-2 text-sm text-gray-700">
				This task is billable
			</label>
		</div>

		<!-- Form Actions -->
		<div class="flex items-center justify-between pt-6 border-t border-gray-200">
			<div>
				{#if showDeleteButton && isEditing}
					<Button
						type="button"
						variant="danger"
						onclick={handleDelete}
						disabled={isSubmitting}
					>
						Delete Task
					</Button>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<Button
					type="button"
					variant="secondary"
					onclick={handleCancel}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					disabled={!isValid || isSubmitting}
					loading={isSubmitting}
					loadingText={isEditing ? 'Updating...' : 'Creating...'}
				>
					{isEditing ? 'Update Task' : 'Create Task'}
				</Button>
			</div>
		</div>

		<!-- Validation Summary -->
		{#if Object.keys(errors).length > 0}
			<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
				<h4 class="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
				<ul class="text-sm text-red-700 space-y-1">
					{#each Object.values(errors) as error}
						<li>• {error}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Warnings -->
		{#if Object.keys(warnings).length > 0}
			<div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
				<h4 class="text-sm font-medium text-yellow-800 mb-2">Recommendations:</h4>
				<ul class="text-sm text-yellow-700 space-y-1">
					{#each Object.values(warnings) as warning}
						<li>• {warning}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</form>
</Card>

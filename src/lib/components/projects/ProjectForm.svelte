<!--
	TimeFlow Pro Project Form Component
	
	Create/edit project form with validation, client name, billing rate, color selection,
	integration with existing form validation patterns, and autosave functionality.
	
	@component
	@example
	```svelte
	<ProjectForm 
		{project}
		on:saved={(event) => handleProjectSaved(event.detail)}
		on:cancelled={() => showForm = false}
		on:deleted={(event) => handleProjectDeleted(event.detail)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Project } from '$lib/types/index.js';
	import { Button, Input, Card } from '$lib/components/ui';
	import { ProjectService } from '$lib/services/project-service.js';
	import { validateRequired, validateNumber } from '$lib/utils/validationUtils.js';

	// Props
	export let project: Partial<Project> | null = null;
	export let showDeleteButton: boolean = false;
	export let autosave: boolean = false;
	export let autosaveDelay: number = 2000; // 2 seconds

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		saved: { project: Project; isNew: boolean };
		cancelled: void;
		deleted: { projectId: string };
	}>();

	// Form state
	let formData: Partial<Project> = {};
	let errors: Record<string, string> = {};
	let warnings: Record<string, string> = {};
	let isSubmitting = false;
	let hasUnsavedChanges = false;
	let autosaveTimeout: number | undefined;

	// Project service instance
	const projectService = new ProjectService();

	// Initialize form data
	$: if (project) {
		formData = { ...project };
	} else {
		formData = projectService.generateDefaultProject();
	}

	$: isEditing = !!(project && project.id);

	// Validation
	$: {
		const validation = projectService.validateProject(formData);
		errors = {};
		warnings = {};
		
		validation.errors.forEach(error => {
			if (error.includes('name')) errors.name = error;
			else if (error.includes('client')) errors.clientName = error;
			else if (error.includes('billing rate')) errors.defaultBillingRate = error;
			else if (error.includes('budget')) errors.budget = error;
			else if (error.includes('color')) errors.colorCode = error;
			else if (error.includes('date')) errors.dates = error;
		});

		validation.warnings.forEach(warning => {
			if (warning.includes('estimated hours')) warnings.estimatedHours = warning;
			else if (warning.includes('currency')) warnings.currency = warning;
		});
	}

	$: isValid = Object.keys(errors).length === 0;

	// Autosave functionality
	function scheduleAutosave() {
		if (!autosave || !isEditing) return;
		
		if (autosaveTimeout) {
			clearTimeout(autosaveTimeout);
		}
		
		autosaveTimeout = setTimeout(() => {
			if (hasUnsavedChanges && isValid) {
				handleSave(undefined, true);
			}
		}, autosaveDelay);
	}

	// Track changes for autosave
	$: if (formData && isEditing) {
		hasUnsavedChanges = true;
		scheduleAutosave();
	}

	// Event handlers
	function handleSave(event?: Event, isAutosave = false) {
		if (event) {
			event.preventDefault();
		}
		if (!isValid || isSubmitting) return;

		isSubmitting = true;

		try {
			const projectToSave: Project = {
				...formData,
				id: formData.id || '',
				createdAt: formData.createdAt || '',
				updatedAt: formData.updatedAt || '',
				actualHours: formData.actualHours || 0
			} as Project;

			dispatch('saved', { 
				project: projectToSave, 
				isNew: !isEditing 
			});

			if (!isAutosave) {
				hasUnsavedChanges = false;
			}
		} catch (error) {
			console.error('Failed to save project:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (hasUnsavedChanges) {
			if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
				dispatch('cancelled');
			}
		} else {
			dispatch('cancelled');
		}
	}

	function handleDelete() {
		if (!project?.id) return;
		
		if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone and will delete all associated tasks and time entries.`)) {
			dispatch('deleted', { projectId: project.id });
		}
	}

	// Color palette for selection
	const colorPalette = projectService.getProjectColorPalette();

	// Cleanup autosave timeout
	onMount(() => {
		return () => {
			if (autosaveTimeout) {
				clearTimeout(autosaveTimeout);
			}
		};
	});
</script>

<Card class="p-6">
	<form onsubmit={handleSave} class="space-y-6">
		<!-- Form Header -->
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900">
				{isEditing ? 'Edit Project' : 'Create New Project'}
			</h2>
			{#if autosave && hasUnsavedChanges}
				<span class="text-sm text-blue-600">Autosaving...</span>
			{/if}
		</div>

		<!-- Project Name -->
		<div>
			<label for="project-name" class="block text-sm font-medium text-gray-700 mb-2">
				Project Name *
			</label>
			<Input
				id="project-name"
				type="text"
				bind:value={formData.name}
				placeholder="Enter project name"
				error={errors.name}
				required
				class="w-full"
			/>
		</div>

		<!-- Client Name -->
		<div>
			<label for="client-name" class="block text-sm font-medium text-gray-700 mb-2">
				Client Name *
			</label>
			<Input
				id="client-name"
				type="text"
				bind:value={formData.clientName}
				placeholder="Enter client name"
				error={errors.clientName}
				required
				class="w-full"
			/>
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
				Description
			</label>
			<textarea
				id="description"
				bind:value={formData.description}
				placeholder="Enter project description (optional)"
				rows="3"
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
			></textarea>
		</div>

		<!-- Billing Rate and Currency -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="billing-rate" class="block text-sm font-medium text-gray-700 mb-2">
					Default Billing Rate *
				</label>
				<Input
					id="billing-rate"
					type="number"
					bind:value={formData.defaultBillingRate}
					placeholder="75.00"
					min="0"
					step="0.01"
					error={errors.defaultBillingRate}
					required
					class="w-full"
				/>
			</div>
			<div>
				<label for="currency" class="block text-sm font-medium text-gray-700 mb-2">
					Currency
				</label>
				<select
					id="currency"
					bind:value={formData.currency}
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
				>
					<option value="USD">USD - US Dollar</option>
					<option value="EUR">EUR - Euro</option>
					<option value="GBP">GBP - British Pound</option>
					<option value="CAD">CAD - Canadian Dollar</option>
					<option value="AUD">AUD - Australian Dollar</option>
				</select>
				{#if warnings.currency}
					<p class="mt-1 text-sm text-yellow-600">{warnings.currency}</p>
				{/if}
			</div>
		</div>

		<!-- Project Color -->
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-2">
				Project Color
			</label>
			<div class="flex flex-wrap gap-2">
				{#each colorPalette as color}
					<button
						type="button"
						class="w-8 h-8 rounded-full border-2 {formData.colorCode === color ? 'border-gray-900' : 'border-gray-300'} hover:border-gray-500 transition-colors"
						style="background-color: {color}"
						onclick={() => formData.colorCode = color}
						aria-label="Select color {color}"
					></button>
				{/each}
			</div>
			{#if errors.colorCode}
				<p class="mt-1 text-sm text-red-600">{errors.colorCode}</p>
			{/if}
		</div>

		<!-- Budget and Estimated Hours -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="budget" class="block text-sm font-medium text-gray-700 mb-2">
					Budget (Optional)
				</label>
				<Input
					id="budget"
					type="number"
					bind:value={formData.budget}
					placeholder="10000.00"
					min="0"
					step="0.01"
					error={errors.budget}
					class="w-full"
				/>
			</div>
			<div>
				<label for="estimated-hours" class="block text-sm font-medium text-gray-700 mb-2">
					Estimated Hours (Optional)
				</label>
				<Input
					id="estimated-hours"
					type="number"
					bind:value={formData.estimatedHours}
					placeholder="40"
					min="0"
					step="0.5"
					class="w-full"
				/>
				{#if warnings.estimatedHours}
					<p class="mt-1 text-sm text-yellow-600">{warnings.estimatedHours}</p>
				{/if}
			</div>
		</div>

		<!-- Project Status -->
		<div>
			<label for="status" class="block text-sm font-medium text-gray-700 mb-2">
				Status
			</label>
			<select
				id="status"
				bind:value={formData.status}
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
			>
				<option value="active">Active</option>
				<option value="completed">Completed</option>
				<option value="on-hold">On Hold</option>
				<option value="cancelled">Cancelled</option>
			</select>
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
				This project is billable
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
						Delete Project
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
					{isEditing ? 'Update Project' : 'Create Project'}
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

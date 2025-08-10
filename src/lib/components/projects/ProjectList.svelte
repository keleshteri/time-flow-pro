<!--
	TimeFlow Pro Project List Component
	
	List all projects with filtering and sorting, search functionality by name or client,
	bulk operations (archive multiple projects), and pagination for large project lists.
	
	@component
	@example
	```svelte
	<ProjectList 
		{projects}
		{summaries}
		on:projectEdit={(event) => editProject(event.detail.project)}
		on:projectArchive={(event) => archiveProject(event.detail.project.id)}
		on:bulkArchive={(event) => archiveMultipleProjects(event.detail.projectIds)}
	/>
	```
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Project, ProjectSummary, ProjectFilter } from '$lib/types/index.js';
	import { Button, Input, Card } from '$lib/components/ui';
	import ProjectCard from './ProjectCard.svelte';
	import { ProjectService } from '$lib/services/project-service.js';

	// Props
	export let projects: Project[] = [];
	export let summaries: ProjectSummary[] = [];
	export let showSearch: boolean = true;
	export let showFilters: boolean = true;
	export let showBulkActions: boolean = true;
	export let pageSize: number = 12;
	export let compact: boolean = false;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		projectEdit: { project: Project };
		projectArchive: { project: Project };
		projectUnarchive: { project: Project };
		projectDelete: { project: Project };
		projectViewTasks: { project: Project };
		projectStartTimer: { project: Project };
		projectViewDetails: { project: Project };
		bulkArchive: { projectIds: string[] };
		bulkDelete: { projectIds: string[] };
	}>();

	// Local state
	let searchQuery = '';
	let selectedStatus: Project['status'] | 'all' = 'all';
	let selectedClient = '';
	let sortBy: 'name' | 'client' | 'created' | 'updated' | 'progress' | 'revenue' = 'updated';
	let sortDirection: 'asc' | 'desc' = 'desc';
	let currentPage = 1;
	let selectedProjectIds: Set<string> = new Set();
	let showArchived = false;

	// Project service instance
	const projectService = new ProjectService();

	// Computed values
	$: filter = {
		status: selectedStatus === 'all' ? undefined : [selectedStatus],
		clientName: selectedClient || undefined,
		search: searchQuery || undefined,
		isArchived: showArchived
	} as ProjectFilter;

	$: filteredProjects = projectService.filterProjects(projects, filter);
	$: sortedProjects = projectService.sortProjects(filteredProjects, sortBy, sortDirection);
	$: paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	$: totalPages = Math.ceil(sortedProjects.length / pageSize);
	$: hasSelection = selectedProjectIds.size > 0;

	// Get summary for a project
	function getSummaryForProject(project: Project): ProjectSummary {
		return summaries.find(s => s.project.id === project.id) || {
			project,
			totalHours: 0,
			totalBillable: 0,
			entryCount: 0,
			taskCount: 0,
			completedTasks: 0,
			progressPercentage: 0,
			lastActivity: undefined
		};
	}

	// Get unique clients for filter
	$: uniqueClients = [...new Set(projects.map(p => p.clientName))].sort();

	// Selection handlers
	function toggleProjectSelection(projectId: string) {
		if (selectedProjectIds.has(projectId)) {
			selectedProjectIds.delete(projectId);
		} else {
			selectedProjectIds.add(projectId);
		}
		selectedProjectIds = new Set(selectedProjectIds);
	}

	function selectAllVisible() {
		paginatedProjects.forEach(project => {
			selectedProjectIds.add(project.id);
		});
		selectedProjectIds = new Set(selectedProjectIds);
	}

	function clearSelection() {
		selectedProjectIds.clear();
		selectedProjectIds = new Set(selectedProjectIds);
	}

	// Bulk action handlers
	function handleBulkArchive() {
		dispatch('bulkArchive', { projectIds: Array.from(selectedProjectIds) });
		clearSelection();
	}

	function handleBulkDelete() {
		if (confirm(`Are you sure you want to delete ${selectedProjectIds.size} projects? This action cannot be undone.`)) {
			dispatch('bulkDelete', { projectIds: Array.from(selectedProjectIds) });
			clearSelection();
		}
	}

	// Pagination handlers
	function goToPage(page: number) {
		currentPage = Math.max(1, Math.min(page, totalPages));
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	// Reset pagination when filters change
	$: if (searchQuery || selectedStatus || selectedClient || showArchived) {
		currentPage = 1;
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
						placeholder="Search projects by name, client, or description..."
						bind:value={searchQuery}
						class="w-full"
						aria-label="Search projects"
					/>
				</div>
			{/if}

			<!-- Filters -->
			{#if showFilters}
				<div class="flex flex-col sm:flex-row gap-3">
					<!-- Status Filter -->
					<select 
						bind:value={selectedStatus}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Filter by status"
					>
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
						<option value="on-hold">On Hold</option>
						<option value="cancelled">Cancelled</option>
					</select>

					<!-- Client Filter -->
					<select 
						bind:value={selectedClient}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Filter by client"
					>
						<option value="">All Clients</option>
						{#each uniqueClients as client}
							<option value={client}>{client}</option>
						{/each}
					</select>

					<!-- Sort Options -->
					<select 
						bind:value={sortBy}
						class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						aria-label="Sort by"
					>
						<option value="updated">Last Updated</option>
						<option value="name">Name</option>
						<option value="client">Client</option>
						<option value="created">Created Date</option>
						<option value="progress">Progress</option>
						<option value="revenue">Revenue</option>
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

					<!-- Show Archived Toggle -->
					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							bind:checked={showArchived}
							class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
						Show Archived
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
				{selectedProjectIds.size} project{selectedProjectIds.size === 1 ? '' : 's'} selected
			</span>
			<div class="flex items-center gap-2">
				<Button
					variant="secondary"
					size="sm"
					onclick={handleBulkArchive}
				>
					Archive Selected
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

<!-- Project Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
	{#each paginatedProjects as project (project.id)}
		<div class="relative">
			<!-- Selection Checkbox -->
			{#if showBulkActions}
				<label class="absolute top-2 left-2 z-10 flex items-center">
					<input
						type="checkbox"
						checked={selectedProjectIds.has(project.id)}
						onchange={() => toggleProjectSelection(project.id)}
						class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						aria-label="Select {project.name}"
					/>
				</label>
			{/if}

			<!-- Project Card -->
			<ProjectCard
				{project}
				summary={getSummaryForProject(project)}
				{compact}
				on:edit={(event) => dispatch('projectEdit', event.detail)}
				on:archive={(event) => dispatch('projectArchive', event.detail)}
				on:unarchive={(event) => dispatch('projectUnarchive', event.detail)}
				on:delete={(event) => dispatch('projectDelete', event.detail)}
				on:viewTasks={(event) => dispatch('projectViewTasks', event.detail)}
				on:startTimer={(event) => dispatch('projectStartTimer', event.detail)}
				on:viewDetails={(event) => dispatch('projectViewDetails', event.detail)}
			/>
		</div>
	{/each}
</div>

<!-- Empty State -->
{#if sortedProjects.length === 0}
	<Card class="p-8 text-center">
		<div class="text-gray-500 mb-4">
			{#if searchQuery || selectedStatus !== 'all' || selectedClient}
				<h3 class="text-lg font-medium mb-2">No projects match your filters</h3>
				<p>Try adjusting your search criteria or filters.</p>
			{:else}
				<h3 class="text-lg font-medium mb-2">No projects yet</h3>
				<p>Create your first project to start tracking time.</p>
			{/if}
		</div>
		<Button
			variant="primary"
			onclick={() => dispatch('projectEdit', { project: projectService.generateDefaultProject() })}
		>
			Create First Project
		</Button>
	</Card>
{/if}

<!-- Pagination -->
{#if totalPages > 1}
	<Card class="p-4">
		<div class="flex items-center justify-between">
			<div class="text-sm text-gray-700">
				Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedProjects.length)} of {sortedProjects.length} projects
			</div>
			
			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onclick={previousPage}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					← Previous
				</Button>
				
				<!-- Page Numbers -->
				{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
					const startPage = Math.max(1, currentPage - 2);
					return startPage + i;
				}).filter(page => page <= totalPages) as page}
					<Button
						variant={page === currentPage ? 'primary' : 'ghost'}
						size="sm"
						onclick={() => goToPage(page)}
						aria-label="Go to page {page}"
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</Button>
				{/each}
				
				<Button
					variant="ghost"
					size="sm"
					onclick={nextPage}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					Next →
				</Button>
			</div>
		</div>
	</Card>
{/if}

<!-- Bulk Selection Actions -->
{#if showBulkActions && paginatedProjects.length > 0}
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
			{selectedProjectIds.size} of {sortedProjects.length} selected
		</div>
	</div>
{/if}

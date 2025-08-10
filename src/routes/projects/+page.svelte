<!--
	TimeFlow Pro Projects Page
	
	Main projects management interface showcasing the complete project management
	foundation with project listing, creation, editing, and task management.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import type { Project, Task, ProjectSummary } from '$lib/types/index.js';
	import { 
		projects, 
		createProject, 
		updateProject, 
		deleteProject,
		archiveProject,
		unarchiveProject,
		activeProjects,
		projectSummaries
	} from '$lib/stores/projects.js';
	import { 
		tasks, 
		createTask, 
		updateTask, 
		deleteTask,
		completeTask,
		startTask,
		activeTasks
	} from '$lib/stores/tasks.js';
	import { timeEntries } from '$lib/stores/projectStore.js';
	import { 
		ProjectCard, 
		ProjectList, 
		ProjectForm, 
		TaskCard, 
		TaskList,
		TaskForm
	} from '$lib/components/projects';
	import { Button, Modal, Card } from '$lib/components/ui';
	import { generateProjectSummary, generateTaskSummary } from '$lib/utils/progress-utils.js';

	// Local state
	let showProjectForm = false;
	let showTaskForm = false;
	let editingProject: Project | null = null;
	let editingTask: Task | null = null;
	let selectedProjectId = '';
	let viewMode: 'projects' | 'tasks' = 'projects';

	// Reactive statements
	$: allProjects = $projects;
	$: allTasks = $tasks;
	$: allTimeEntries = $timeEntries;
	$: summaries = allProjects.map(project => 
		generateProjectSummary(project, allTasks, allTimeEntries)
	);
	$: taskSummaries = allTasks.map(task => {
		const project = allProjects.find(p => p.id === task.projectId);
		return generateTaskSummary(task, allTimeEntries, project);
	});

	// Event handlers
	function handleCreateProject() {
		editingProject = null;
		showProjectForm = true;
	}

	function handleEditProject(event: CustomEvent<{ project: Project }>) {
		editingProject = event.detail.project;
		showProjectForm = true;
	}

	function handleProjectSaved(event: CustomEvent<{ project: Project; isNew: boolean }>) {
		const { project, isNew } = event.detail;
		
		if (isNew) {
			createProject(project);
		} else {
			updateProject(project.id, project);
		}
		
		showProjectForm = false;
		editingProject = null;
	}

	function handleProjectArchive(event: CustomEvent<{ project: Project }>) {
		const { project } = event.detail;
		if (project.isArchived) {
			unarchiveProject(project.id);
		} else {
			archiveProject(project.id);
		}
	}

	function handleProjectDelete(event: CustomEvent<{ project: Project }>) {
		const { project } = event.detail;
		if (confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated tasks and time entries.`)) {
			deleteProject(project.id);
		}
	}

	function handleViewTasks(event: CustomEvent<{ project: Project }>) {
		selectedProjectId = event.detail.project.id;
		viewMode = 'tasks';
	}

	function handleCreateTask() {
		editingTask = null;
		showTaskForm = true;
	}

	function handleEditTask(event: CustomEvent<{ task: Task }>) {
		editingTask = event.detail.task;
		showTaskForm = true;
	}

	function handleTaskSaved(event: CustomEvent<{ task: Task; isNew: boolean }>) {
		const { task, isNew } = event.detail;
		
		if (isNew) {
			createTask(task);
		} else {
			updateTask(task.id, task);
		}
		
		showTaskForm = false;
		editingTask = null;
	}

	function handleTaskComplete(event: CustomEvent<{ task: Task }>) {
		completeTask(event.detail.task.id);
	}

	function handleTaskStart(event: CustomEvent<{ task: Task }>) {
		startTask(event.detail.task.id);
	}

	function handleTaskDelete(event: CustomEvent<{ task: Task }>) {
		const { task } = event.detail;
		if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
			deleteTask(task.id);
		}
	}

	// Initialize with sample data if empty
	onMount(() => {
		if (allProjects.length === 0) {
			// Create sample project
			const projectId = createProject({
				name: 'TimeFlow Pro Development',
				clientName: 'Internal',
				description: 'Development of the TimeFlow Pro time tracking application',
				defaultBillingRate: 100,
				colorCode: '#3B82F6',
				status: 'active',
				estimatedHours: 200,
				actualHours: 0,
				budget: 20000,
				currency: 'USD',
				tags: ['development', 'internal'],
				isBillable: true,
				isArchived: false
			});

			// Create sample tasks
			createTask({
				projectId,
				title: 'Project Management Foundation',
				description: 'Implement comprehensive project and task management system',
				estimatedHours: 40,
				actualHours: 0,
				priority: 'high',
				status: 'completed',
				tags: ['backend', 'stores'],
				completionPercentage: 100,
				isBillable: true
			});

			createTask({
				projectId,
				title: 'Offline Architecture',
				description: 'Implement offline-first data synchronization',
				estimatedHours: 30,
				actualHours: 0,
				priority: 'high',
				status: 'pending',
				tags: ['architecture', 'sync'],
				completionPercentage: 0,
				isBillable: true
			});

			createTask({
				projectId,
				title: 'Advanced Timer Features',
				description: 'Add advanced timer functionality and integrations',
				estimatedHours: 25,
				actualHours: 0,
				priority: 'medium',
				status: 'pending',
				tags: ['timer', 'features'],
				completionPercentage: 0,
				isBillable: true
			});
		}
	});

	// Filter tasks for selected project
	$: filteredTasks = selectedProjectId 
		? allTasks.filter(task => task.projectId === selectedProjectId)
		: allTasks;

	$: selectedProject = allProjects.find(p => p.id === selectedProjectId);
</script>

<svelte:head>
	<title>Projects - TimeFlow Pro</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Page Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">
				{viewMode === 'projects' ? 'Projects' : 'Tasks'}
			</h1>
			<p class="text-gray-600 mt-2">
				{viewMode === 'projects' 
					? 'Manage your projects and track progress' 
					: selectedProject 
						? `Tasks for ${selectedProject.name}`
						: 'Manage your tasks across all projects'
				}
			</p>
		</div>

		<div class="flex items-center gap-3">
			{#if viewMode === 'tasks'}
				<Button
					variant="secondary"
					onclick={() => { viewMode = 'projects'; selectedProjectId = ''; }}
				>
					← Back to Projects
				</Button>
			{/if}
			
			<Button
				variant="primary"
				onclick={viewMode === 'projects' ? handleCreateProject : handleCreateTask}
			>
				{viewMode === 'projects' ? 'New Project' : 'New Task'}
			</Button>
		</div>
	</div>

	<!-- View Toggle -->
	<div class="flex items-center gap-4 mb-6">
		<div class="flex bg-gray-100 rounded-lg p-1">
			<button
				class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
				onclick={() => { viewMode = 'projects'; selectedProjectId = ''; }}
			>
				Projects ({allProjects.length})
			</button>
			<button
				class="px-4 py-2 rounded-md text-sm font-medium transition-colors {viewMode === 'tasks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
				onclick={() => viewMode = 'tasks'}
			>
				Tasks ({allTasks.length})
			</button>
		</div>
	</div>

	<!-- Projects View -->
	{#if viewMode === 'projects'}
		<ProjectList
			projects={allProjects}
			{summaries}
			on:projectEdit={handleEditProject}
			on:projectArchive={handleProjectArchive}
			on:projectUnarchive={handleProjectArchive}
			on:projectDelete={handleProjectDelete}
			on:projectViewTasks={handleViewTasks}
			on:projectStartTimer={(event) => console.log('Start timer for project:', event.detail.project.name)}
			on:projectViewDetails={(event) => console.log('View details for project:', event.detail.project.name)}
		/>
	{/if}

	<!-- Tasks View -->
	{#if viewMode === 'tasks'}
		<TaskList
			tasks={filteredTasks}
			summaries={taskSummaries.filter(s => !selectedProjectId || s.task.projectId === selectedProjectId)}
			projects={allProjects}
			groupBy={selectedProjectId ? 'status' : 'project'}
			on:taskEdit={handleEditTask}
			on:taskDelete={handleTaskDelete}
			on:taskComplete={handleTaskComplete}
			on:taskStart={handleTaskStart}
			on:taskStartTimer={(event) => console.log('Start timer for task:', event.detail.task.title)}
			on:createTimeEntry={(event) => console.log('Create time entry for task:', event.detail.task.title)}
		/>
	{/if}

	<!-- Project Form Modal -->
	<Modal bind:open={showProjectForm}>
		<ProjectForm
			project={editingProject}
			showDeleteButton={!!editingProject}
			on:saved={handleProjectSaved}
			on:cancelled={() => { showProjectForm = false; editingProject = null; }}
			on:deleted={handleProjectDelete}
		/>
	</Modal>

	<!-- Task Form Modal -->
	<Modal bind:open={showTaskForm}>
		<TaskForm
			task={editingTask}
			{projects}
			selectedProjectId={selectedProjectId}
			showDeleteButton={!!editingTask}
			on:saved={handleTaskSaved}
			on:cancelled={() => { showTaskForm = false; editingTask = null; }}
			on:deleted={handleTaskDelete}
		/>
	</Modal>

	<!-- Quick Stats -->
	<Card class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="text-center">
				<div class="text-2xl font-bold text-blue-600">{$activeProjects.length}</div>
				<div class="text-sm text-gray-600">Active Projects</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-green-600">{$activeTasks.length}</div>
				<div class="text-sm text-gray-600">Active Tasks</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-yellow-600">
					{summaries.reduce((sum, s) => sum + s.totalHours, 0).toFixed(1)}h
				</div>
				<div class="text-sm text-gray-600">Total Hours</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-purple-600">
					${summaries.reduce((sum, s) => sum + s.totalBillable, 0).toLocaleString()}
				</div>
				<div class="text-sm text-gray-600">Total Revenue</div>
			</div>
		</div>
	</Card>
</div>

# Building TimeFlow Pro - Task 1.5: Project Management Foundation

## 🚨 MANDATORY: READ THESE FIRST
**Before writing any code, you MUST:**
1. **Read CHANGELOG.md** - Review recent entries and understand current project state
2. **Read and follow AI-RULES.md** - All development rules and standards
3. **Use exact versions from TECH-STACK.md** - Never downgrade packages
4. **Research current documentation** - Latest best practices and syntax

## Context
I'm implementing the project management foundation for TimeFlow Pro. This builds on the completed timer and form components to add comprehensive project and task organization with progress tracking and data relationships.

## Reference Files
**REQUIRED FILES TO ATTACH:**
- [ ] `CHANGELOG.md` (Critical - project memory and context)
- [ ] `AI-RULES.md` (Critical - forbidden practices and standards)
- [ ] `TECH-STACK.md` (Critical - exact versions to use)
- [ ] `tasks.md` (Specific task requirements)
- [ ] `design.md` (Architecture and patterns)
- [ ] `technical-assumptions.md` (Implementation guidelines)

## Previous Work Dependencies
**This task builds on:**
- Task 1.1: SvelteKit foundation and UI components
- Task 1.2: Component library (Button, Input, Card, Modal)
- Task 1.3: Timer engine and stores
- Task 1.4: Time entry forms and validation

## Specific Task (from tasks.md)
Story 1.5: Project Management Foundation
- Create project and task data models with TypeScript interfaces
- Implement project and task stores with CRUD operations
- Build project management components with progress tracking
- Add data relationships between projects, tasks, and time entries

## What I Need You to Create:

### 1. Data Models & Interfaces (`src/lib/types/`):
**`src/lib/types/project.ts`:**
```typescript
interface Project {
  id: string;
  name: string;
  clientName: string;
  description?: string;
  defaultBillingRate: number;
  colorCode: string;
  status: 'active' | 'archived' | 'completed';
  estimatedHours?: number;
  actualHours: number; // calculated from time entries
  createdAt: string;
  updatedAt: string;
}
```

**`src/lib/types/task.ts`:**
```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  estimatedHours?: number;
  actualHours: number; // calculated from time entries
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  asanaTaskId?: string; // for future Asana integration
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}
```

### 2. Stores (`src/lib/stores/`):
**`src/lib/stores/projects.ts`:**
- Writable store for projects array
- CRUD operations (create, read, update, delete)
- Derived stores for active projects, project summaries
- Integration with localStorage persistence

**`src/lib/stores/tasks.ts`:**
- Writable store for tasks array
- CRUD operations with project relationship validation
- Progress calculation based on time entries
- Task filtering and sorting capabilities

### 3. Project Management Components (`src/lib/components/projects/`):
**`ProjectCard.svelte`:**
- Display project summary with progress indicators
- Show total hours, active tasks, revenue calculations
- Quick actions (edit, archive, view details)
- Responsive design with consistent styling

**`ProjectList.svelte`:**
- List all projects with filtering and sorting
- Search functionality by name or client
- Bulk operations (archive multiple projects)
- Pagination for large project lists

**`ProjectForm.svelte`:**
- Create/edit project form with validation
- Client name, billing rate, color selection
- Integration with existing form validation patterns
- Autosave functionality

**`TaskCard.svelte`:**
- Individual task display with status indicators
- Progress bar based on estimated vs actual hours
- Priority and due date visualization
- Quick edit capabilities

**`TaskList.svelte`:**
- Task list with project grouping
- Filtering by status, priority, project
- Drag-and-drop reordering (basic)
- Integration with time entry creation

### 4. Services (`src/lib/services/`):
**`project-service.ts`:**
- Business logic for project operations
- Progress calculation algorithms
- Data validation and integrity checks
- Integration with time entry calculations

**`task-service.ts`:**
- Task management business logic
- Progress tracking calculations
- Due date and priority management
- Relationship validation with projects

### 5. Utilities (`src/lib/utils/`):
**`progress-utils.ts`:**
- Progress calculation helpers
- Time allocation utilities
- Status determination logic
- Performance metrics calculations

## Requirements:
- Follow TypeScript interfaces from design.md data models
- Integrate with existing timer and time entry systems
- Use existing UI components (Button, Input, Card, Modal)
- Implement proper data persistence with localStorage
- Include comprehensive error handling and validation
- Add proper accessibility attributes and keyboard navigation
- Use TailwindCSS for all styling with design system consistency
- Include progress indicators and visual feedback

## Expected Output:
1. Complete TypeScript interfaces for projects and tasks
2. Reactive Svelte stores with full CRUD operations
3. Comprehensive project management components
4. Business logic services with progress tracking
5. Integration with existing timer and time entry systems
6. Comprehensive tests for stores and components
7. Storybook stories for all new components

## Success Criteria:
- Can create, edit, and manage projects with proper validation
- Tasks link correctly to projects with data integrity
- Progress calculations work accurately based on time entries
- All components integrate seamlessly with existing UI library
- Data persists correctly across browser sessions
- Components work with keyboard navigation and screen readers
- Performance remains smooth with 100+ projects and 1000+ tasks

## Integration Requirements:
- **With Timer System:** Projects/tasks selectable in timer widget
- **With Time Entries:** Automatic progress calculation from logged time
- **With Form Validation:** Consistent validation patterns and error handling
- **With UI Components:** Use existing Button, Input, Card, Modal components

## Usage Example Expected:
```svelte
<script lang="ts">
  import { ProjectCard, TaskList, ProjectForm } from '$lib/components/projects';
  import { projects, tasks } from '$lib/stores';
  import { Modal } from '$lib/components/ui';
  
  let showProjectForm = false;
</script>

{#each $projects as project}
  <ProjectCard 
    {project}
    on:edit={() => showProjectForm = true}
    on:viewTasks={() => /* show tasks */}
  />
{/each}

<TaskList 
  tasks={$tasks.filter(t => t.projectId === selectedProject)}
  on:createTimeEntry={(event) => /* start timer or manual entry */}
/>

<Modal bind:open={showProjectForm}>
  <ProjectForm 
    on:saved={() => showProjectForm = false}
    on:cancelled={() => showProjectForm = false}
  />
</Modal>
```

## MANDATORY: Update CHANGELOG.md
**After completing implementation, add comprehensive entry including:**
- All components and stores created
- Data model decisions and relationships
- Integration points with existing systems
- Any technical challenges and solutions
- Testing status and coverage
- Next steps for Task 1.6 (offline architecture)

## Testing Requirements:
- Unit tests for all stores and business logic
- Component tests for user interactions
- Integration tests with timer and time entry systems
- Data persistence tests across browser sessions
- Performance tests with large datasets
- Accessibility tests for keyboard navigation

---

**🎯 This task creates the foundation for all project management features. Ensure robust data relationships and seamless integration with existing timer functionality!**

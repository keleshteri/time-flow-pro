# Building TimeFlow Pro - Task 1.4: Manual Time Entry with Form Validation

## Context

I'm implementing the manual time entry system for TimeFlow Pro. Users need to be able to enter time periods manually with intelligent validation, duration calculation, and seamless integration with projects and tasks.

## Reference Files

[Attach: tasks.md, design.md, requirements.md]

## Specific Task (from tasks.md)

Story 1.4: Manual Time Entry with Form Validation

- Create TimeEntryForm.svelte with date/time inputs and validation
- Implement intelligent validation with overnight work support
- Add project/task selection and category management
- Build user experience enhancements with keyboard shortcuts

## What I Need You to Create:

### 1. Time Entry Form Component (`src/lib/components/forms/TimeEntryForm.svelte`):

- Date picker with keyboard navigation
- Start time and end time inputs with validation
- Automatic duration calculation with manual override
- Project and task selection dropdowns with search
- Description field with autosave and character count
- Category selection with icons and color coding

### 2. Time Entry Store (`src/lib/stores/timeEntries.ts`):

```typescript
interface TimeEntry {
	id: string;
	projectId: string;
	taskId?: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:MM
	endTime: string; // HH:MM
	duration: number; // hours as decimal
	description: string;
	category: 'development' | 'review' | 'meeting' | 'research' | 'fix' | 'other';
	billableHours: number;
	createdAt: string;
	updatedAt: string;
}
```

### 3. Validation Service (`src/lib/services/validation-service.ts`):

- Time range validation with overnight support
- Overlap detection and conflict resolution
- Duration calculation with timezone handling
- Required field validation with contextual errors

### 4. Time Entry List Component (`src/lib/components/forms/TimeEntryList.svelte`):

- Display recent time entries with edit/delete functionality
- Filtering by date range, project, and category
- Bulk operations for editing multiple entries
- Export functionality for selected entries

### 5. Form Utilities (`src/lib/utils/form-utils.ts`):

- Date/time formatting and parsing
- Duration calculation helpers
- Validation rule definitions
- Autosave functionality

### 6. TypeScript Interfaces (`src/lib/types/timeEntry.ts`):

- TimeEntry interface with all fields
- TimeEntryInput interface for form data
- ValidationError interface
- Category and status enums

## Requirements:

- Validate time ranges including overnight work (e.g., 23:00 to 02:00)
- Prevent overlapping time entries with clear conflict resolution
- Calculate duration automatically with manual override option
- Support timezone-aware time entry for traveling users
- Implement autosave to prevent data loss
- Add keyboard shortcuts for rapid entry workflow
- Provide contextual validation errors with suggested fixes
- Include undo/redo functionality for error correction

## Expected Output:

1. Complete time entry form with all validation features
2. Time entry store with CRUD operations and persistence
3. Validation service handling all edge cases
4. Time entry list with filtering and bulk operations
5. Comprehensive tests covering validation scenarios
6. Integration with existing timer and project systems

## Success Criteria:

- Form validates all edge cases including overnight and cross-timezone scenarios
- Time entries persist reliably with data integrity guarantees
- Form achieves AAA accessibility compliance with screen reader support
- User can complete time entry in < 30 seconds for common scenarios
- Validation provides helpful, actionable error messages
- Autosave prevents data loss during form completion

## Usage Example Expected:

```svelte
<script lang="ts">
	import { TimeEntryForm, TimeEntryList } from '$lib/components/forms';
	import { timeEntries } from '$lib/stores/timeEntries';
</script>

<TimeEntryForm
	projectId="project-123"
	on:saved={(event) => console.log('Time entry saved:', event.detail)}
	on:cancelled={() => console.log('Entry cancelled')}
/>

<TimeEntryList
	entries={$timeEntries}
	dateRange={{ start: '2025-08-01', end: '2025-08-31' }}
	on:edit={(event) => editEntry(event.detail)}
	on:delete={(event) => deleteEntry(event.detail)}
/>
```

## Validation Examples to Handle:

- Overnight work: Start 23:30, End 02:15 (next day)
- Weekend work with different timezone
- Overlapping entries with suggestion to split or merge
- Invalid time ranges (end before start on same day)
- Maximum daily hours limits with warnings
- Required fields based on company policies

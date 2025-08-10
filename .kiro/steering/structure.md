# Project Structure & Organization

## Root Directory Structure

```
time-flow-pro/
├── .github/           # GitHub workflows and templates
├── .kiro/            # Kiro AI assistant configuration
├── .storybook/       # Storybook configuration
├── .svelte-kit/      # SvelteKit generated files (auto-generated)
├── docs/             # Project documentation
├── e2e/              # End-to-end tests
├── node_modules/     # Dependencies (auto-generated)
├── src/              # Source code
├── static/           # Static assets
└── package.json      # Project configuration
```

## Source Directory (`src/`)

```
src/
├── lib/              # Reusable components and utilities
│   ├── assets/       # Shared assets (icons, images)
│   └── index.ts      # Library exports
├── routes/           # SvelteKit routes (pages)
│   ├── +layout.svelte    # Root layout
│   ├── +page.svelte      # Home page
│   └── *.svelte.spec.ts  # Page-specific tests
├── stories/          # Storybook component stories
│   ├── assets/       # Story-specific assets
│   ├── *.stories.svelte  # Component stories
│   └── *.svelte      # Story components
├── app.css           # Global styles
├── app.d.ts          # Global type definitions
├── app.html          # HTML template
└── *.spec.ts         # General test files
```

## Documentation Structure (`docs/`)

- `architecture.md` - Technical architecture overview
- `brief.md` - Product brief and vision
- `prd.md` - Product Requirements Document
- `pre_prd.md` - Pre-PRD planning
- `prd/` - Detailed PRD sections
- `prompts/` - Development prompts and tasks

## Configuration Files

- `svelte.config.js` - SvelteKit configuration with static adapter
- `vite.config.ts` - Vite build configuration with testing setup
- `tsconfig.json` - TypeScript configuration extending SvelteKit defaults
- `eslint.config.js` - ESLint configuration with Svelte and Storybook support
- `playwright.config.ts` - E2E testing configuration
- `package.json` - Dependencies and npm scripts

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `Button.svelte`, `TimerWidget.svelte`)
- **Pages**: lowercase with + prefix (e.g., `+page.svelte`, `+layout.svelte`)
- **Stories**: Component name + `.stories.svelte` (e.g., `Button.stories.svelte`)
- **Tests**: Component/file name + `.spec.ts` or `.test.ts`
- **Utilities**: camelCase (e.g., `timeUtils.ts`, `apiClient.ts`)

### Code Conventions
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Functions**: camelCase
- **CSS Classes**: Tailwind utility classes preferred

## Import Patterns

```typescript
// SvelteKit aliases
import { Component } from '$lib/components/Component.svelte';
import { utility } from '$lib/utils/utility.ts';

// Relative imports for local files
import './component.css';
import type { LocalType } from './types.ts';
```

## Testing Organization

- **Unit Tests**: Co-located with components (`.spec.ts` files)
- **E2E Tests**: Separate `e2e/` directory with Playwright
- **Component Tests**: Storybook stories serve as visual tests
- **Browser Tests**: Vitest with Playwright provider for DOM testing
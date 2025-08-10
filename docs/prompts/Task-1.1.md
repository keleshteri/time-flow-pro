# Building TimeFlow Pro - Task 1.1: SvelteKit Foundation

## Context
I'm starting TimeFlow Pro, a professional time tracking app. I need to set up the SvelteKit foundation following our architecture decisions.

## Reference Files
[Attach: tasks.md, technical-assumptions.md, design.md]

## Specific Task (from tasks.md)
Story 1.1: SvelteKit Project Foundation & Development Excellence
- Initialize SvelteKit project with TypeScript and static adapter
- Configure development tooling (ESLint, Prettier, Vitest, Playwright, Storybook)  
- Set up TailwindCSS with design system
- Create project structure as defined in technical-assumptions.md

## What I Need You to Create:
1. Complete package.json with all dependencies from technical-assumptions.md
2. All configuration files (vite.config.ts, tsconfig.json, tailwind.config.js, eslint.config.js, prettier.config.js)
3. Basic project structure following design.md specifications:
   ```
   src/
   ├── app.html
   ├── app.css
   ├── routes/
   │   ├── +layout.svelte
   │   └── +page.svelte
   └── lib/
       ├── components/
       ├── stores/
       ├── services/
       ├── utils/
       └── types/
   ```
4. Example app.html with PWA meta tags and performance hints
5. Basic +layout.svelte with navigation structure for TimeFlow Pro
6. Simple +page.svelte dashboard to verify everything works
7. Storybook configuration (.storybook/main.ts, preview.ts)
8. Testing setup (vitest.config.ts, playwright.config.ts)

## Requirements:
- TypeScript strict mode as specified in technical-assumptions.md
- Follow the exact folder structure from design.md
- Include all testing tools mentioned in tasks.md (Vitest, Playwright, Storybook)
- Add TailwindCSS with forms and typography plugins
- Configure ESLint with Svelte-specific rules
- Set up Prettier with Svelte plugin
- Add helpful comments explaining each configuration choice
- Include pre-commit hooks setup with Husky

## Expected Output:
Working SvelteKit project that I can:
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. See a basic TimeFlow Pro dashboard at localhost:3000
4. Run `npm run test` to execute unit tests
5. Run `npm run storybook` to view component documentation
6. Have all linting and formatting working correctly

## Success Criteria:
- All dependencies install without conflicts
- Development server starts without errors
- Page loads with "TimeFlow Pro" branding and basic navigation
- All configuration files are properly set up and commented
- Project structure matches design.md specifications exactly

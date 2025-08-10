# Building TimeFlow Pro - Task 1.1: SvelteKit Foundation

## 🚨 MANDATORY: READ THESE FIRST
**Before writing any code, you MUST:**
1. Read and follow ALL rules in `AI-RULES.md`
2. Use EXACT package versions from `TECH-STACK.md`  
3. NEVER downgrade package versions
4. Research current SvelteKit 2.0 documentation for best practices

## Context
I'm starting TimeFlow Pro, a professional time tracking app. I need to set up the SvelteKit foundation following our architecture decisions and using the exact package versions specified in our documentation.

## Reference Files
**REQUIRED FILES TO ATTACH:**
- [ ] `AI-RULES.md` (Critical - contains forbidden practices)
- [ ] `TECH-STACK.md` (Critical - exact versions to use)
- [ ] `tasks.md` (Specific task requirements)
- [ ] `design.md` (Architecture and patterns)
- [ ] `technical-assumptions.md` (Implementation guidelines)

## Specific Task (from tasks.md)
Story 1.1: SvelteKit Project Foundation & Development Excellence
- Initialize SvelteKit project with TypeScript and static adapter
- Configure development tooling (ESLint, Prettier, Vitest, Playwright, Storybook)  
- Set up TailwindCSS with design system
- Create project structure as defined in technical-assumptions.md

## CRITICAL PACKAGE VERSION REQUIREMENTS
**Use these EXACT versions (from TECH-STACK.md):**
```json
{
  "@sveltejs/adapter-static": "^3.0.2",
  "@sveltejs/kit": "^2.0.0",
  "svelte": "^4.2.18", 
  "typescript": "^5.5.3",
  "vite": "^5.3.5",
  "tailwindcss": "^3.4.0",
  "@tailwindcss/forms": "^0.5.7",
  "@tailwindcss/typography": "^0.5.13"
}
```
**❌ DO NOT downgrade any of these versions!**

## What I Need You to Create:
1. **Complete package.json** with ALL dependencies from TECH-STACK.md
2. **All configuration files** with latest syntax:
   - `vite.config.ts` (SvelteKit 2.0 syntax)
   - `tsconfig.json` (TypeScript 5.5 strict mode)
   - `tailwind.config.js` (TailwindCSS 3.4 with plugins)
   - `eslint.config.js` (ESLint flat config)
   - `prettier.config.js` (Prettier 3.0 config)
   - `vitest.config.ts` (Vitest 2.0 config)
   - `playwright.config.ts` (Playwright 1.45 config)
   - `.storybook/main.ts` (Storybook 8.1 config)

3. **Project structure** following design.md:
   ```
   src/
   ├── app.html (PWA meta tags)
   ├── app.css (TailwindCSS imports)
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

4. **Example implementation** with TypeScript interfaces
5. **Basic tests** to verify setup works

## Requirements:
- TypeScript strict mode as specified in technical-assumptions.md
- Follow the exact folder structure from design.md
- Include ALL testing tools mentioned in tasks.md
- Use latest SvelteKit 2.0 syntax and patterns
- Research current documentation for each tool
- Add comprehensive comments explaining configurations

## Expected Output:
Working SvelteKit project that I can:
1. Run `npm install` (no version conflicts)
2. Run `npm run dev` (starts without errors)
3. See "TimeFlow Pro" page at localhost:5173
4. Run `npm run test` (Vitest works)
5. Run `npm run test:e2e` (Playwright works)
6. Run `npm run storybook` (Storybook works)
7. Run `npm run lint` (ESLint passes)
8. Run `npm run format` (Prettier works)

## MANDATORY Verification Checklist:
**Before submitting, verify:**
- [ ] All packages use EXACT versions from TECH-STACK.md
- [ ] No package version downgrades
- [ ] TypeScript 5.5 strict mode enabled
- [ ] SvelteKit 2.0 syntax used (not 1.x patterns)
- [ ] TailwindCSS 3.4 configuration with plugins
- [ ] ESLint flat config (not legacy .eslintrc)
- [ ] All configuration files have proper TypeScript types
- [ ] Project structure matches design.md exactly
- [ ] Comprehensive comments explain each config choice

## Success Criteria:
- Zero TypeScript errors or warnings
- All tools (ESLint, Prettier, Vitest, Playwright, Storybook) work correctly
- Page loads with proper TimeFlow Pro branding
- All package versions match TECH-STACK.md requirements
- Configuration follows 2025 best practices (not outdated patterns)

---

**🚨 CRITICAL: If you downgrade ANY package versions, the entire setup will fail. Use the exact versions specified!**

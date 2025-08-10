---
type: "always_apply"
---

# TimeFlow Pro - AI Development Rules & Standards

## 🚨 CRITICAL RULES - AI MUST FOLLOW

### **1. NEVER DOWNGRADE PACKAGES**

❌ **FORBIDDEN**: Changing package versions to older versions  
✅ **REQUIRED**: Always use the exact versions specified in our documentation

**Current Tech Stack Versions (DO NOT CHANGE):**

```json
{
	"svelte": "^4.2.18",
	"sveltekit": "^2.0.0",
	"@sveltejs/vite-plugin-svelte": "^3.0.2",
	"typescript": "^5.5.3",
	"vite": "^5.3.5",
	"tailwindcss": "^3.4.0",
	"@tailwindcss/forms": "^0.5.7",
	"@tailwindcss/typography": "^0.5.13",
	"vitest": "^2.0.4",
	"playwright": "^1.45.0",
	"@storybook/sveltekit": "^8.1.11",
	"eslint": "^8.50.0",
	"prettier": "^3.0.3"
}
```

### **2. MANDATORY RESEARCH BEFORE CODING**

Before writing any code, AI MUST:

1. **Check official documentation** for current best practices
2. **Verify package compatibility** with our tech stack
3. **Review breaking changes** in package updates
4. **Confirm syntax** for the specific versions we use

### **3. PACKAGE MANAGEMENT RULES**

- **NO version downgrades** - Ever
- **NO deprecated packages** - Use maintained alternatives
- **NO experimental features** - Unless explicitly requested
- **NO conflicting dependencies** - Check peer dependency warnings

### **4. CODE QUALITY STANDARDS**

- **TypeScript strict mode** - No `any` types unless absolutely necessary
- **Comprehensive error handling** - Always include try/catch and user feedback
- **Accessibility first** - ARIA labels, semantic HTML, keyboard navigation
- **Performance optimized** - Code splitting, lazy loading where appropriate
- **Consistent styling** - Use our TailwindCSS design system only

## 📋 REQUIRED VERIFICATION CHECKLIST

Before submitting any code, AI must verify:

### **Package Versions:**

- [ ] All packages match our specified versions
- [ ] No version conflicts in package.json
- [ ] No deprecated packages used
- [ ] Peer dependencies satisfied

### **Code Quality:**

- [ ] TypeScript strict mode compliance
- [ ] ESLint rules followed (no warnings)
- [ ] Prettier formatting applied
- [ ] Comprehensive error handling included

### **Architecture Compliance:**

- [ ] Follows SvelteKit best practices
- [ ] Uses our established folder structure
- [ ] Implements our design patterns
- [ ] Integrates with existing stores/services

### **Documentation:**

- [ ] JSDoc comments for complex functions
- [ ] Component prop documentation
- [ ] Usage examples provided
- [ ] Error scenarios documented

## 🔍 RESEARCH REQUIREMENTS

### **Before Any Implementation:**

1. **Check Current Documentation:**
   - SvelteKit official docs for latest patterns
   - TailwindCSS docs for utility classes
   - Vitest docs for testing patterns
   - Playwright docs for E2E testing

2. **Verify Package Status:**
   - Check npm for latest stable versions
   - Review GitHub issues for known problems
   - Confirm maintenance status (not abandoned)
   - Check security advisories

3. **Compatibility Verification:**
   - Test package combinations work together
   - Check peer dependency requirements
   - Verify TypeScript definition availability
   - Confirm SvelteKit compatibility

## ⛔ FORBIDDEN PRACTICES

### **Never Do:**

- Downgrade package versions without explicit approval
- Use deprecated APIs or packages
- Ignore TypeScript errors or warnings
- Skip accessibility attributes
- Use inline styles instead of TailwindCSS
- Create global CSS unless absolutely necessary
- Use `any` type without justification
- Skip error handling for async operations
- Ignore ESLint or Prettier rules
- Create components without proper TypeScript interfaces

### **Always Do:**

- Use latest stable versions from our approved list
- Include comprehensive error handling
- Add proper TypeScript interfaces
- Follow our established patterns
- Add accessibility attributes
- Use TailwindCSS for all styling
- Include JSDoc for complex functions
- Write tests for new functionality
- Follow our folder structure
- Document component usage

## 🛡️ SECURITY & BEST PRACTICES

### **Security Rules:**

- **No hardcoded secrets** - Use environment variables
- **Input validation** - Sanitize all user inputs
- **XSS prevention** - Proper data binding in Svelte
- **CSRF protection** - Use SvelteKit's built-in protection
- **Dependency auditing** - Only use trusted packages

### **Performance Rules:**

- **Code splitting** - Use SvelteKit's automatic splitting
- **Lazy loading** - For non-critical components
- **Image optimization** - Proper sizing and formats
- **Bundle analysis** - Keep bundles under size limits
- **Memory management** - Proper cleanup in components

## 📦 APPROVED PACKAGE ECOSYSTEM

### **Core Framework:**

- SvelteKit 2.0+ (latest stable)
- TypeScript 5.5+ (latest stable)
- Vite 5.3+ (latest stable)

### **Styling:**

- TailwindCSS 3.4+ (latest stable)
- @tailwindcss/forms (latest stable)
- @tailwindcss/typography (latest stable)

### **Testing:**

- Vitest 2.0+ (latest stable)
- Playwright 1.45+ (latest stable)
- @testing-library/svelte (latest stable)

### **Development:**

- Storybook 8.1+ (latest stable)
- ESLint 8.50+ (latest stable)
- Prettier 3.0+ (latest stable)

### **Pre-approved Additions:**

```json
{
	"date-fns": "^3.6.0",
	"uuid": "^10.0.0",
	"chart.js": "^4.4.0",
	"lucide-svelte": "^0.395.0",
	"dexie": "^4.0.8"
}
```

## 🔄 UPDATE PROTOCOL

### **When Packages Need Updates:**

1. **Research thoroughly** - Check breaking changes
2. **Test in isolation** - Create test branch
3. **Update documentation** - Reflect changes in rules
4. **Get approval** - Don't update production without review
5. **Document migration** - If breaking changes exist

### **Version Compatibility Matrix:**

Always check these compatibility requirements:

- SvelteKit + Vite versions
- TypeScript + SvelteKit versions
- Storybook + SvelteKit versions
- Testing framework versions
- TailwindCSS + PostCSS versions

## 🎯 SUCCESS CRITERIA

Code is acceptable only if:

- [ ] All packages use approved versions
- [ ] Zero TypeScript errors or warnings
- [ ] ESLint passes with no violations
- [ ] Prettier formatting applied
- [ ] Tests included and passing
- [ ] Accessibility requirements met
- [ ] Performance requirements met
- [ ] Documentation provided
- [ ] Error handling comprehensive
- [ ] Security best practices followed

## 🔍 DEBUGGING PROTOCOL

### **When Issues Arise:**

1. **Check versions first** - Usually the root cause
2. **Review package changelogs** - For breaking changes
3. **Clear node_modules** - Fresh install often fixes issues
4. **Check peer dependencies** - Install missing requirements
5. **Verify configuration** - Config files often cause issues

### **Common Issue Resolutions:**

- **Build errors**: Check TypeScript config and versions
- **Styling issues**: Verify TailwindCSS configuration
- **Test failures**: Check testing framework versions
- **Import errors**: Verify package export/import patterns

---

**⚠️ CRITICAL REMINDER: These rules exist to prevent hours of debugging. Following them saves time and ensures consistent, high-quality code that integrates seamlessly with our architecture.**


## 📝 MANDATORY CHANGELOG REQUIREMENTS

### **EVERY AI CODING SESSION MUST:**
1. **Read CHANGELOG.md first** - Understand what has been completed
2. **Update CHANGELOG.md last** - Document all changes made
3. **Follow the exact format** - Use the template structure
4. **Be comprehensive** - Include all files, decisions, and issues

### **CHANGELOG UPDATE PROTOCOL:**

#### **At START of coding session:**
```markdown
1. Read CHANGELOG.md completely
2. Review "Next Steps/TODO" from previous sessions
3. Check "Issues Encountered" for known problems
4. Understand current project state and context
```

#### **During coding session:**
```markdown
1. Note all technical decisions made
2. Track any issues encountered and solutions
3. Document new dependencies or configuration changes
4. Record any deviations from planned approach
```

#### **At END of coding session:**
```markdown
1. Add new entry to CHANGELOG.md using the template
2. Update progress tracking section
3. List all files created/modified
4. Document any follow-up tasks needed
5. Add notes for future AI sessions
```

### **REQUIRED CHANGELOG ENTRY FORMAT:**

```markdown
### **[2025-08-10] - Task 1.1: SvelteKit Foundation**
**Status:** ✅ Completed  
**Developer:** Claude AI Assistant  
**Duration:** 45 minutes  

#### **What Was Implemented:**
- [x] SvelteKit project initialization with TypeScript
- [x] All development tools configured (ESLint, Prettier, Vitest, Playwright, Storybook)
- [x] TailwindCSS setup with forms and typography plugins
- [x] Basic project structure following design.md

#### **Technical Decisions Made:**
- Used flat ESLint config (eslint.config.js) instead of legacy .eslintrc
- Configured Vitest with @sveltejs/vite-plugin-svelte for proper Svelte component testing
- Set up TailwindCSS with JIT mode for optimal performance

#### **Dependencies Added/Updated:**
```json
{
  "@sveltejs/kit": "^2.0.0",
  "typescript": "^5.5.3", 
  "tailwindcss": "^3.4.0",
  "reason": "Core framework setup following TECH-STACK.md requirements"
}
```

#### **Issues Encountered & Resolved:**
- **Issue:** Initial ESLint configuration used legacy format
- **Solution:** Updated to flat config format for ESLint 8.50+
- **Prevention:** Always check ESLint docs for current configuration format

#### **Files Created/Modified:**
```
package.json (NEW)
vite.config.ts (NEW)
tsconfig.json (NEW)
tailwind.config.js (NEW)
eslint.config.js (NEW)
prettier.config.js (NEW)
src/app.html (NEW)
src/app.css (NEW)
src/routes/+layout.svelte (NEW)
src/routes/+page.svelte (NEW)
```

#### **Testing Status:**
- [x] All development tools start without errors
- [x] TypeScript compilation successful
- [x] ESLint and Prettier working correctly
- [x] Basic page renders with TimeFlow Pro branding

#### **Next Steps/TODO:**
- [ ] Task 1.2: Implement core UI component library
- [ ] Create Button, Input, Modal, Card components
- [ ] Set up Storybook stories for components

#### **Notes for Future AI Sessions:**
- Project structure is ready for component development
- All tools are configured and working
- Remember to use exact package versions from TECH-STACK.md
- ESLint flat config is working - don't revert to legacy format
```

### **CHANGELOG READING REQUIREMENTS:**

Before starting ANY new task, AI must:

#### **1. Review Recent Entries:**
- Read last 3-5 changelog entries
- Understand current project state
- Check for any blocking issues or dependencies

#### **2. Check Progress Status:**
- Review "Development Progress" section
- Identify which tasks are completed vs. pending
- Understand task dependencies and order

#### **3. Learn from Previous Issues:**
- Review "Issues & Solutions Database"
- Check "Technical Decisions Log" for context
- Understand patterns and best practices established

#### **4. Understand Context:**
- Read "Notes for Future AI Sessions" from recent entries
- Check "Next Steps/TODO" items from previous work
- Understand any specific requirements or constraints

### **BENEFITS OF CHANGELOG SYSTEM:**

#### **For AI Development:**
- **Project Memory** - Each session builds on previous work
- **Avoid Repetition** - Don't solve the same problems twice
- **Context Awareness** - Understand decisions and rationale
- **Quality Continuity** - Maintain consistent standards across sessions

#### **For Human Developer:**
- **Progress Tracking** - See exactly what has been accomplished
- **Decision History** - Understand why choices were made
- **Issue Prevention** - Learn from previous problems
- **Knowledge Base** - Searchable history of solutions and patterns

### **CHANGELOG QUALITY STANDARDS:**

#### **Entry Must Include:**
- [ ] Clear task identification and status
- [ ] Comprehensive list of changes made
- [ ] Technical decisions with reasoning
- [ ] All files created or modified
- [ ] Any issues encountered and solutions
- [ ] Next steps for continuation
- [ ] Context for future sessions

#### **Entry Must NOT:**
- [ ] Skip technical details or decisions
- [ ] Forget to list modified files
- [ ] Ignore issues that were encountered
- [ ] Leave out dependency changes
- [ ] Skip testing status updates

---

**🎯 REMEMBER: The changelog is the project's memory. Each AI session depends on previous sessions documenting their work thoroughly. Poor changelog entries break the development chain!**

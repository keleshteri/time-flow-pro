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

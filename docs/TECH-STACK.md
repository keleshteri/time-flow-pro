# TimeFlow Pro - Tech Stack Reference Card

## 🎯 EXACT VERSIONS TO USE (Never Downgrade!)

### **Core Framework:**
```json
{
  "@sveltejs/adapter-static": "^3.0.2",
  "@sveltejs/kit": "^2.0.0", 
  "@sveltejs/vite-plugin-svelte": "^3.0.2",
  "svelte": "^4.2.18",
  "vite": "^5.3.5"
}
```

### **TypeScript & Build:**
```json
{
  "typescript": "^5.5.3",
  "@tsconfig/svelte": "^5.0.4",
  "tslib": "^2.6.3"
}
```

### **Styling:**
```json
{
  "tailwindcss": "^3.4.0",
  "@tailwindcss/forms": "^0.5.7",
  "@tailwindcss/typography": "^0.5.13",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.38"
}
```

### **Testing:**
```json
{
  "vitest": "^2.0.4",
  "@vitest/ui": "^2.0.4",
  "playwright": "^1.45.0",
  "@playwright/test": "^1.45.0",
  "@testing-library/svelte": "^5.2.0"
}
```

### **Development Tools:**
```json
{
  "storybook": "^8.1.11",
  "@storybook/addon-essentials": "^8.1.11",
  "@storybook/addon-svelte-csf": "^4.1.4",
  "@storybook/sveltekit": "^8.1.11",
  "eslint": "^8.50.0",
  "@typescript-eslint/eslint-plugin": "^7.15.0",
  "@typescript-eslint/parser": "^7.15.0",
  "eslint-plugin-svelte": "^2.42.0",
  "prettier": "^3.0.3",
  "prettier-plugin-svelte": "^3.2.6"
}
```

## 🚨 CRITICAL INSTRUCTIONS FOR AI

### **Before Writing ANY Code:**
1. **✅ USE THESE EXACT VERSIONS** - Copy from above
2. **❌ NEVER downgrade** packages to older versions
3. **🔍 CHECK OFFICIAL DOCS** for latest syntax/patterns
4. **⚠️ VERIFY COMPATIBILITY** between packages

### **Package Research Protocol:**
```markdown
Before using any package, verify:
1. Is it in our approved list above?
2. Does it work with SvelteKit 2.0+?
3. Does it support TypeScript 5.5+?
4. Is it actively maintained (updates in last 6 months)?
5. Are there any security vulnerabilities?
```

### **Common Mistakes to Avoid:**
- ❌ Using `@sveltejs/kit@1.x` (outdated)
- ❌ Using `typescript@4.x` (too old)  
- ❌ Using `vite@4.x` (outdated)
- ❌ Using deprecated TailwindCSS syntax
- ❌ Using old Storybook configuration patterns

## 📚 Documentation Sources (Check First!)

### **Primary Sources:**
- **SvelteKit**: https://kit.svelte.dev/docs
- **Svelte**: https://svelte.dev/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Vitest**: https://vitest.dev/guide/
- **Playwright**: https://playwright.dev/docs/intro

### **Before Implementation:**
1. Read the relevant docs section
2. Check for breaking changes in recent versions  
3. Look for official examples using our versions
4. Verify syntax matches current best practices

## 🎯 Quality Gates

### **Code Must Pass:**
- [ ] TypeScript compilation with zero errors
- [ ] ESLint with zero warnings
- [ ] Prettier formatting applied
- [ ] All tests passing
- [ ] No security vulnerabilities
- [ ] No deprecated package usage

---

**📌 REMEMBER: These versions are tested and work together. Downgrading causes compatibility issues and wastes development time!**

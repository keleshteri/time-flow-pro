# AI Prompt Template - TimeFlow Pro (Updated with Changelog)

## 🚨 MANDATORY: AI MUST READ THESE FIRST
**Before writing any code, you MUST:**
1. **Read CHANGELOG.md** - Review recent entries and project state
2. **Read and follow AI-RULES.md** - All development rules and standards
3. **Use exact versions from TECH-STACK.md** - Never downgrade packages
4. **Research current documentation** - Latest best practices and syntax

## Context
[Describe what you're building and current project state]

## Reference Files
**REQUIRED FILES TO ATTACH:**
- [ ] `CHANGELOG.md` (Critical - project memory and context)
- [ ] `AI-RULES.md` (Critical - forbidden practices and standards)
- [ ] `TECH-STACK.md` (Critical - exact versions to use)
- [ ] `tasks.md` (Specific task requirements)
- [ ] `design.md` (Architecture and patterns)
- [ ] `technical-assumptions.md` (Implementation guidelines)

**OPTIONAL FILES:**
- [ ] `requirements.md` (If specific requirements referenced)
- [ ] Existing code files (If building on previous work)

## Previous Work Review
**From CHANGELOG.md, I can see:**
- Last completed task: [Task X.X - Brief description]
- Current project state: [Summary of what's working]
- Known issues: [Any blockers or problems to be aware of]
- Next steps identified: [What previous session recommended]

## Specific Task
[Copy exact task from tasks.md]

## What I Need You to Create
[Specific deliverables with file paths and interfaces]

## CRITICAL REQUIREMENTS
**Package Versions:**
- ✅ Use EXACT versions from TECH-STACK.md
- ❌ NEVER downgrade packages
- 🔍 Research latest documentation before coding

**Code Quality:**
- TypeScript strict mode with comprehensive interfaces
- ESLint + Prettier compliance (zero warnings)
- Comprehensive error handling with user feedback
- WCAG 2.1 AA accessibility compliance
- TailwindCSS for ALL styling (no custom CSS)

**Architecture:**
- Follow patterns established in design.md
- Use SvelteKit best practices from official docs
- Build on previous work documented in CHANGELOG.md
- Maintain consistency with completed components

## Expected Output
[Specific files, interfaces, and functionality expected]

## Success Criteria
[How to verify the implementation works correctly]

## MANDATORY: Update CHANGELOG.md
**After completing the implementation, you MUST:**

1. **Add new changelog entry** using this format:
```markdown
### **[2025-08-10] - Task X.X: [Task Name]**
**Status:** ✅ Completed  
**Developer:** Claude AI Assistant  
**Duration:** [Estimated time]  

#### **What Was Implemented:**
- [x] Feature 1 - Description
- [x] Feature 2 - Description

#### **Technical Decisions Made:**
- Decision 1: Reasoning
- Decision 2: Reasoning

#### **Dependencies Added/Updated:**
```json
{
  "package-name": "version",
  "reason": "why it was added"
}
```

#### **Issues Encountered & Resolved:**
- **Issue:** Description
- **Solution:** How it was fixed

#### **Files Created/Modified:**
[List all files with NEW/UPDATED status]

#### **Testing Status:**
- [ ] Tests written and passing
- [ ] Manual testing completed

#### **Next Steps/TODO:**
- [ ] Follow-up task recommendations

#### **Notes for Future AI Sessions:**
[Important context for next sessions]
```

2. **Update progress tracking** in CHANGELOG.md
3. **Add any new technical decisions** to the decisions log
4. **Document any issues** in the solutions database

## Verification Checklist
**Before submitting code, verify:**
- [ ] All packages use approved versions from TECH-STACK.md
- [ ] TypeScript compilation with zero errors
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] Comprehensive error handling included
- [ ] Accessibility attributes present
- [ ] Tests included and passing
- [ ] Documentation/comments provided
- [ ] Integration with existing code works
- [ ] Performance requirements met
- [ ] **CHANGELOG.md updated with comprehensive entry**

---

**🎯 REMEMBER: The changelog is the project's memory. Document everything so future AI sessions can build effectively on your work!**

---
type: "always_apply"
---

# Changelog Rules - Quick Reference

## 🔄 AI SESSION WORKFLOW

### **1. BEFORE CODING (Read Phase):**
```markdown
✅ Read CHANGELOG.md completely
✅ Review last 3-5 entries for context
✅ Check "Next Steps/TODO" from previous sessions
✅ Review "Issues & Solutions Database" for known problems
✅ Understand current project state and dependencies
```

### **2. DURING CODING (Track Phase):**
```markdown
📝 Note all technical decisions made
📝 Track issues encountered and solutions
📝 Document new dependencies or configuration changes
📝 Record any deviations from planned approach
📝 Save important context for future sessions
```

### **3. AFTER CODING (Document Phase):**
```markdown
📋 Add comprehensive changelog entry
📋 Update progress tracking section
📋 List ALL files created/modified
📋 Document follow-up tasks needed
📋 Add notes for future AI sessions
```

## 📝 CHANGELOG ENTRY TEMPLATE

```markdown
### **[YYYY-MM-DD] - Task X.X: [Task Name]**
**Status:** ✅ Completed | 🚧 In Progress | ❌ Blocked  
**Developer:** Claude AI Assistant  
**Duration:** [Time estimate]  

#### **What Was Implemented:**
- [x] Specific feature/component implemented
- [x] Configuration changes made
- [x] Integration completed

#### **Technical Decisions Made:**
- Choice made: Why this approach was chosen
- Alternative considered: Why it was rejected

#### **Dependencies Added/Updated:**
```json
{
  "package-name": "^1.0.0",
  "reason": "Specific reason for addition"
}
```

#### **Issues Encountered & Resolved:**
- **Issue:** Specific problem description
- **Solution:** How it was resolved
- **Prevention:** How to avoid in future

#### **Files Created/Modified:**
```
src/path/file.svelte (NEW)
src/path/existing.ts (UPDATED - added feature X)
config.js (UPDATED - changed setting Y)
```

#### **Testing Status:**
- [x] Unit tests written and passing
- [x] Component tests completed
- [x] Manual testing completed

#### **Next Steps/TODO:**
- [ ] Specific follow-up task 1
- [ ] Integration needed with component X
- [ ] Optimization or enhancement needed

#### **Notes for Future AI Sessions:**
Critical context, gotchas, or important considerations for next session.
```

## ⚠️ CRITICAL REQUIREMENTS

### **MUST DOCUMENT:**
- ✅ Every file created or modified
- ✅ All technical decisions and reasoning
- ✅ Any dependencies added or updated
- ✅ Issues encountered and how resolved
- ✅ Current status and next steps
- ✅ Context for future sessions

### **MUST NOT:**
- ❌ Skip changelog updates
- ❌ Leave out technical details
- ❌ Forget to document decisions
- ❌ Skip file modification lists
- ❌ Ignore issues encountered
- ❌ Leave unclear next steps

## 🎯 WHY THIS MATTERS

### **Project Continuity:**
- Each AI session builds on previous work
- Prevents repeating solved problems
- Maintains architectural consistency
- Preserves important context and decisions

### **Quality Assurance:**
- Tracks all changes for debugging
- Documents learning and best practices
- Enables rollback if needed
- Provides complete development history

### **Efficiency:**
- Reduces time spent understanding context
- Prevents re-solving same problems
- Enables better decision making
- Accelerates future development

---

**💡 REMEMBER: Good changelog entries save hours of debugging and context-gathering in future sessions!**

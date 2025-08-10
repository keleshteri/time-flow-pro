# TimeFlow Pro - AI Coding Prompts

This folder contains ready-to-use AI prompts for implementing each task in the TimeFlow Pro development roadmap. Each prompt is carefully crafted to provide optimal context and specifications for AI-assisted development.

## 📋 How to Use These Prompts

### 1. **Select the Right Prompt**

- Find the prompt file corresponding to your current task (e.g., `Task-1.1.md` for foundation setup)
- Each prompt is self-contained with all necessary context and requirements

### 2. **Attach Required Files**

Each prompt specifies which documentation files to attach:

- **Always Include**: `tasks.md`, `design.md`, `technical-assumptions.md`
- **Sometimes Include**: `requirements.md`, `prd.md`, specific component examples

### 3. **Copy and Customize**

- Copy the entire prompt content
- Customize the "Context" section if needed for your specific situation
- Adjust "Expected Output" based on your immediate needs

### 4. **Iterative Development**

- Start with the basic prompt
- After getting initial code, ask for refinements
- Request additional features or fixes as needed

## 🎯 Prompt Categories

### **Foundation Tasks (1.1 - 1.6)**

- Project setup and configuration
- Core component library
- Basic timer functionality
- Data persistence and offline support

### **Feature Tasks (2.1+)**

- Advanced timer features
- Project management
- Billing and reporting
- Integration with external services

### **Quality Tasks (10.1+)**

- Testing implementation
- Performance optimization
- Security enhancements
- Documentation improvements

## 💡 Best Practices

### **When Using Prompts:**

1. **Read the entire prompt** before submitting to understand expectations
2. **Attach all referenced files** for proper context
3. **Be specific about what you need** - complete implementation vs. guidance
4. **Test the output** and report back any issues for iteration

### **For Best Results:**

- Use prompts in sequence (1.1 → 1.2 → 1.3, etc.)
- Don't skip foundation tasks - they build on each other
- Customize prompts based on your development environment
- Iterate on the output until it meets the acceptance criteria

### **File Organization:**

```
docs/prompts/
├── README.md                 # This file
├── Task-1.1.md              # SvelteKit Foundation
├── Task-1.2.md              # Component Library
├── Task-1.3.md              # Timer Engine
├── Task-1.4.md              # Manual Time Entry
├── Task-1.5.md              # Project Management
├── Task-1.6.md              # Offline Architecture
└── [Additional tasks...]
```

## 🔄 Feedback Loop

### **After Using a Prompt:**

1. **Test the generated code** thoroughly
2. **Document any issues** or improvements needed
3. **Update the prompt** if you discover better approaches
4. **Share successful patterns** with the team

### **Prompt Improvement:**

- Add edge cases discovered during development
- Include additional context that proved helpful
- Refine requirements based on actual implementation experience
- Update success criteria based on real-world testing

## 🚀 Advanced Usage

### **Combining Prompts:**

```markdown
I'm working on Tasks 1.2 and 1.3 together. I need the Button component
from Task 1.2 to work with the Timer controls from Task 1.3.

[Combine relevant sections from both prompts]
```

### **Custom Variations:**

```markdown
Based on Task 1.1 prompt, but I'm using a different deployment target:

- Instead of Netlify/Vercel, I need Docker deployment
- Add specific Docker configuration requirements
```

### **Debugging Prompts:**

```markdown
I implemented Task 1.3 but the timer accuracy is off. Help me debug:
[Include specific error details and current implementation]
```

## 📊 Success Metrics

Track your success with these prompts:

- **Time to Implementation**: How long from prompt to working code?
- **Code Quality**: Does output meet acceptance criteria on first try?
- **Integration Success**: How well do components work together?
- **Learning Value**: Do you understand the generated code?

## 🎯 Next Steps

1. **Start with Task 1.1** to establish foundation
2. **Follow the sequence** outlined in tasks.md
3. **Iterate and improve** prompts based on your experience
4. **Build incrementally** testing each component thoroughly

---

_These prompts are designed to accelerate development while maintaining code quality and architectural consistency. Use them as starting points and adapt based on your specific needs and development style._

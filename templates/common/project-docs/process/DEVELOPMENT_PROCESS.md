# AI-Assisted Development Process

This document outlines the core development process for AI-assisted work on this project.

## Complete Development Cycle

### 1. Planning Phase
1. Create/update project brief in project-docs/process/PROJECT_BRIEF.md
2. Develop technical implementation plan following project-docs/technical/TECHNICAL_PLANNING.md
3. Break down the plan into tasks in todo.md

### 2. Development Phase
1. **Select a Task** from todo.md
2. **Start a New Chat Session** with your AI assistant
3. **Use the Standard Prompt** from AI_PROMPT_TEMPLATE.md
4. **Complete the Task** (write tests, implement, validate)
5. **Update Documentation** (todo.md and memory.md)
6. **Commit Changes** with descriptive message
7. **Repeat** with a new chat for the next task

### 3. Review Phase
1. Run all tests and fix warnings
2. Review code changes
3. Update documentation
4. Create PR with detailed description

## Standard Development Prompt

```
Continue working on the project. Follow the development guidelines in 
project-docs/guidelines/development.md, and remember everything in memory.md.

Our current task from todo.md is:
[Copy specific task here]

Let's proceed with [specific next action].
```

See [AI_PROMPT_TEMPLATE.md](AI_PROMPT_TEMPLATE.md) for additional prompt templates.

## Task Workflow Details

### Before Starting
- Review memory.md for context
- Select one task per chat session
- Move task to "In Progress" in todo.md

### During Implementation
- Follow Test-Driven Development
- Keep the conversation focused on a single task
- Fix ALL warnings and errors (zero tolerance)

### After Completion
- Mark task complete in todo.md
- Update memory.md with:
  - Changes made
  - Key decisions
  - Learnings
- Commit with format: "feat: [task] - [description]"

## Troubleshooting

### Lost Context Between Sessions
- Ensure memory.md is updated after each task
- Reference specific files/components in prompts
- Create smaller, more focused tasks

### AI Generating Incorrect Solutions
- Verify test cases cover edge cases
- Provide clearer acceptance criteria in tasks
- Reference existing patterns in the codebase

### Managing Complex Tasks
- Break tasks into smaller subtasks
- Focus on one capability at a time
- Use the Task Breakdown prompt from AI_PROMPT_TEMPLATE.md

## Key Best Practices

- **One Task Per Session**: Complete one task before starting another
- **Memory Updates**: Keep memory.md current to maintain context
- **Focused Scope**: Limit each chat to a specific, well-defined task
- **Zero Tolerance**: Fix all warnings and errors before completing
- **TDD Approach**: Write tests before implementation
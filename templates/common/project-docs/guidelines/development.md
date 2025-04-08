# Development Guidelines for AI Assistance

This document provides essential rules for AI-assisted development. For complete workflow details, see [project-docs/process/DEVELOPMENT_PROCESS.md](../process/DEVELOPMENT_PROCESS.md).

## Code Quality Standards

- Write tests first (TDD approach)
- Maintain zero tolerance for warnings/errors
- Follow language-specific best practices
- Type everything in TypeScript/C# projects
- Use clear, descriptive variable and function names
- Document public APIs and complex logic
- Keep functions small and focused
- Follow the project's architectural patterns

## Test-Driven Development Process

1. Write failing test(s) for the functionality
2. Implement minimal code to pass tests
3. Run tests:
   - JavaScript/TypeScript: `npm test` or `npm test -- -t "TestName"`
   - .NET: `dotnet test` or `dotnet test --filter "FullyQualifiedName~TestClass"`
4. Refactor while keeping tests passing
5. Repeat for next piece of functionality

## Task Completion Requirements

When a task is complete:

1. All tests must pass
2. No warnings or errors remain
3. Code follows project standards
4. Documentation is updated
5. todo.md is updated: `[ ]` → `[X]`
6. memory.md records changes and decisions
7. Changes are committed with descriptive message

## Memory Management

memory.md must include:
- Current project state
- Recent implementations and changes
- Important decisions and their rationale
- Known limitations or technical debt
- Next planned development areas

## Commit Message Format

```
<type>: [task] - <description>

[optional detailed explanation]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code restructuring
- test: Test addition/correction
- chore: Routine tasks, maintenance

## AI Assistance Rules

- One task per chat session
- Frequent, incremental progress
- Clear task boundaries
- Focus on quality over quantity
- Maintain context between sessions
- Follow project architecture consistently

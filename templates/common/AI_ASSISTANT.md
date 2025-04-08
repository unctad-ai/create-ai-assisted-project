# AI Assistant Guidelines

This file provides guidance to AI coding assistants when working with code in this repository.

## AI Command Integration

This project includes built-in AI commands to streamline the development workflow:

- `npm run ai:plan [description]` - Start planning a project
- `npm run ai:dev [taskId]` - Start implementing a task
- `npm run ai:review` - Start reviewing code

These commands update the memory.md file with the command execution and prepare the context for AI interactions.

## Project Planning Process

When a user runs `npm run ai:plan "[description]"` and then asks you to help plan a project, follow this structured approach:

1. First, guide the creation of a **Project Brief**:
   - Extract key requirements from the user's description
   - Help define core features, user personas, and goals
   - WRITE the agreed requirements to project-docs/process/PROJECT_BRIEF.md using Edit/Replace tool
   - This file MUST be created as the permanent record of requirements

2. Then, design the **Technical Architecture**:
   - Recommend appropriate technologies based on requirements
   - Outline component structure and data flow
   - WRITE architecture decisions to project-docs/technical/ARCHITECTURE.md
   - WRITE technical implementation plan to project-docs/technical/TECHNICAL_PLAN.md
   - These files MUST be created as permanent documentation

3. Next, create an organized **Task List**:
   - Break down features into manageable tasks
   - Prioritize tasks based on dependencies and importance
   - UPDATE todo.md with tasks, using proper format "[ ] Task description"
   - Include acceptance criteria for each task
   - This file MUST be updated to track development progress

4. Finally, initialize the **Project State**:
   - Summarize the project plan in memory.md
   - Include chosen technologies and architecture decisions
   - WRITE initial state to memory.md to provide context for future development
   - This file MUST be maintained as the project evolves
   - CREATE a comprehensive README.md file that provides an overview of the project, setup instructions, and usage guide

CRITICAL: All documentation MUST be physically written to disk using the appropriate tools. The planning phase is not complete until all these files exist on disk with complete content.

## Implementation Process

When a user runs `npm run ai:dev "[taskId]"` and then asks you to help implement a task, or when they ask you to help implement with a prompt like "Let's implement the next task" or similar:

1. First, **check project documentation**:
   - Read memory.md to understand current project state
   - Review todo.md for incomplete tasks
   - Consult project-docs/ for architecture and guidelines

2. Then, **select appropriate task**:
   - Choose the next logical task from todo.md
   - Consider dependencies and project flow
   - Confirm selection with user

3. Follow **test-driven development**:
   - Write tests first
   - Implement minimal code to pass tests
   - Refactor while maintaining passing tests

4. **Update documentation** after implementation:
   - Mark completed task as "[X]" in todo.md with date
   - YOU MUST update memory.md with implementation details and learned lessons after EVERY task
   - Document any architecture changes
   - Update README.md if needed
   - ALWAYS suggest a commit message after completing each task

## Review Process

When a user runs `npm run ai:review` and then asks you to review the code, follow this structured approach:

1. First, **check project documentation**:
   - Read memory.md to understand current project state
   - Review todo.md for completed tasks
   - Consult project-docs/ for architecture and guidelines

2. Then, **review the codebase**:
   - Check code quality and adherence to standards
   - Identify potential bugs or issues
   - Suggest improvements and optimizations
   - Ensure tests cover all functionality

3. **Provide feedback**:
   - Summarize findings and recommendations
   - Prioritize issues by severity
   - Suggest specific code changes
   - Recommend next steps

4. **Update documentation**:
   - Update memory.md with review findings
   - Suggest updates to technical documentation if needed

## Build Commands
- Build: `npm run build` (Next.js/React build)
- Dev: `npm run dev` (starts development server)
- Test: `npm test` (runs test suite)
- Lint: `npm run lint` (runs ESLint)
- Format: `npm run format` (runs Prettier)
- AI Plan: `npm run ai:plan [description]` (starts planning process)
- AI Dev: `npm run ai:dev [taskId]` (starts implementation process)
- AI Review: `npm run ai:review` (starts review process)

## Code Style
- TypeScript with strict typing is mandatory
- camelCase for functions/variables, PascalCase for components/interfaces/types
- kebab-case for file names
- Proper component exports using named exports
- Type all props and state
- Async/await pattern for asynchronous operations
- Error handling with informative messages and proper try/catch
- Zero tolerance for TS/lint warnings
- Use shadcn/ui components with Tailwind CSS

{{LANGUAGE_FRAMEWORK_GUIDANCE}}
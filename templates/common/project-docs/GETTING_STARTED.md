# Getting Started

This guide will help you start using the AI-assisted development workflow with a new project created from this template.

## First-Time Setup

After creating your project with `@unctad-ai/create-ai-assisted-project`, follow these steps:

1. **Explore Project Structure**
   ```bash
   ls -la
   ```
   - Note the `project-docs/`, `memory.md`, and `todo.md` files

2. **Install Dependencies** (if not done during project creation)
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Initial Planning Phase

Before writing any code, work with your AI assistant to define your project:

1. **Create Project Brief**
   ```
   Help me create a project brief. Let's fill out project-docs/process/PROJECT_BRIEF.md with the requirements for our [type of application].
   ```

2. **Develop Technical Plan**
   ```
   Based on our PROJECT_BRIEF.md, let's create a technical implementation plan following project-docs/technical/TECHNICAL_PLANNING.md.
   ```

3. **Create Task List**
   ```
   Based on the technical plan, let's update todo.md with specific tasks organized by priority.
   ```

4. **Initialize Memory File**
   ```
   Let's update memory.md with our initial project context including architecture and technology choices.
   ```

## Development Workflow

For each task in your todo.md file:

1. **Start New Chat Session** with your AI assistant

2. **Use Standard Prompt**
   ```
   Continue working on the project. Follow the development guidelines in project-docs/guidelines/development.md, and remember everything in memory.md.

   Our current task from todo.md is:
   [Copy specific task here]

   Let's proceed with [testing/implementing/refactoring].
   ```

3. **Complete the Task** following test-driven development principles

4. **Update Documentation**
   - Mark task complete in todo.md with date
   - Update memory.md with project state changes
   - Commit changes with descriptive message

5. **Start a New Chat** for the next task

## Template-Specific Setup

### React TypeScript Template

- Tailwind CSS is pre-configured
- shadcn/ui components available in `src/components/ui/`
- Use `npm run dev` to start development server

### Next.js Template

- App Router configured in `src/app/`
- API routes can be added in `src/app/api/`
- Use `npm run dev` to start development server

## Troubleshooting

### Common Issues

- **LLM Losing Context**: Ensure memory.md is kept up-to-date
- **Unclear Tasks**: Break down vague tasks into specific, actionable items
- **Testing Issues**: Refer to CLAUDE.md for testing conventions

### Getting Help

For questions or problems with the template:
- Review relevant documentation in the `project-docs/` directory
- Check the GitHub repository for issues and solutions
- Reach out to the community for assistance
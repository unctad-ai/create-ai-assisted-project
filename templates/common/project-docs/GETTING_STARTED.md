# Getting Started

This guide provides a streamlined approach to AI-assisted development.

## Quick Start

After creating your project with `npx @unctad-ai/create-ai-assisted-project my-project`:

1. **Install dependencies** (if not done during setup)
   ```bash
   cd my-project
   npm install
   ```

2. **Start your development server**
   ```bash
   npm run dev
   ```

## Two-Step Development Process

### Step 1: Planning Phase

**First, instruct your AI coding assistant to read the guidelines:**

```
Please read the AI_ASSISTANT.md file in this project to understand how to work with this codebase.
```

**Then, ask it to help plan the project:**

```
Help me plan this project: [brief description of your project idea].

Let's collaborate to define requirements, architecture, and create a task list.
```

The AI will guide you through:
- Creating a project brief in project-docs/process/PROJECT_BRIEF.md
- Designing the technical architecture in project-docs/technical/ files
- Breaking down tasks and adding them to todo.md
- Setting up the initial project state in memory.md
- Updating all required documentation files

IMPORTANT: The AI will persist all this information in your project's files automatically, creating a permanent reference for future development.

### Step 2: Implementation Phase

**For each development cycle, simply ask:**

```
Please read the AI_ASSISTANT.md file if you haven't already.

Let's implement the next task for this project. Use the documentation in project-docs/
and follow the implementation guidelines.
```

The AI will:
- Consult project-docs/ for context
- Read memory.md for project state
- Select the next logical task from todo.md
- Guide you through implementation with TDD
- Update documentation as you complete work

## Project Organization

- **project-docs/** - Planning and process documentation
- **memory.md** - Current project state (updated after each session)
- **todo.md** - Task tracking and priorities
- **CLAUDE.md** - Technical standards and guidelines

## Additional Commands

For specific implementation needs:

- **Implement specific task:**
  ```
  Let's implement: [specific task from todo.md]
  ```

- **Review and improve code:**
  ```
  Review this implementation: [specific component/feature]
  ```

- **Add a new feature:**
  ```
  Let's add a new feature: [feature description]
  ```

## Template Features

This template includes:
- TypeScript configuration
- Testing setup
- Modern UI components with shadcn/ui + Tailwind CSS
- Optimized folder structure
- Comprehensive AI workflow tools
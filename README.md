# AI-Enhanced Project Template

This repository provides a structured template for creating new software projects with built-in AI development workflow support. It's designed to streamline development using AI coding agents while maintaining high code quality and consistent practices.

## Quick Start

Create a new project using our template with the interactive setup:

```bash
npx @unctad-ai/create-ai-assisted-project@latest
```

Or with specific options:

```bash
npx @unctad-ai/create-ai-assisted-project@latest my-app --template next-app
```

## Features

- 🤖 **AI-First Development**: Optimized workflow for AI pair programming
- 📝 **Project Memory**: Built-in context management between AI sessions
- ✅ **Task Tracking**: Integrated todo system for progress management
- 🎨 **Modern UI**: shadcn/ui + Tailwind CSS for all projects
- 🧪 **Testing Focus**: Test-driven development by default
- 📚 **Documentation**: Comprehensive guidelines and best practices

## Available Templates

- `next-app` - Next.js application (App Router) + TypeScript + shadcn/ui (default)
- `react-ts` - React with TypeScript + shadcn/ui

## Working with AI (Quick Guide)

1. **Setup Your Project**
   ```bash
   npx @unctad-ai/create-ai-assisted-project@latest my-app
   cd my-app
   ```

2. **Understand Key Files**
   - `memory.md` - Project context for the AI assistant
   - `todo.md` - Task tracking (update after each task)
   - `CLAUDE.md` - Coding standards and technical guidelines
   - `project-docs/` - Comprehensive project documentation:
     - `project-docs/guidelines/` - Development and review standards
     - `project-docs/process/` - AI workflow methodologies
     - `project-docs/technical/` - Architecture and planning guides

3. **Project Planning Phase** (Critical First Step)
   - Work with your AI assistant to define the project:
     ```
     Help me create a project brief for [project description]. 
     Let's fill out the project-docs/process/PROJECT_BRIEF.md template with our requirements.
     ```
   - Create a technical implementation plan:
     ```
     Based on our PROJECT_BRIEF.md, let's create a technical implementation plan
     following the guidelines in project-docs/technical/TECHNICAL_PLANNING.md. Please help me
     think through the data models, APIs, and component structure.
     ```
   - Break down the plan into tasks:
     ```
     Now that we have our technical plan, let's create a task list in todo.md,
     organized by priority and dependencies. Each task should have clear
     acceptance criteria.
     ```
   - Initialize the memory file:
     ```
     Let's update memory.md with our initial project state, including our chosen
     architecture, key technologies, and implementation approach.
     ```

4. **Start Development**
   - Choose a task from `todo.md`
   - Start a new AI chat session
   - Use this consistent prompt format:
     ```
     Continue working on the project. Follow the development guidelines in 
     project-docs/guidelines/development.md, and remember everything in memory.md.

     Our current task from todo.md is:
     [Copy specific task here]

     Let's proceed with [writing tests/implementing/etc].
     ```

5. **Complete Tasks**
   - Update `todo.md` when tasks are complete
   - Update `memory.md` with important changes
   - Use one chat session per task
   - Commit changes with descriptive messages

6. **AI Review Process**
   - Regularly review your work with the AI using:
     ```
     Review the current state of the [feature/component]. 
     Follow the guidelines in project-docs/guidelines/review.md.
     
     We've implemented:
     - [List of completed elements]
     
     Check the code quality, test coverage, and documentation completeness.
     ```

7. **Get Started with Documentation**
   - Read `project-docs/GETTING_STARTED.md` for quick onboarding
   - Follow `project-docs/process/DEVELOPMENT_PROCESS.md` for detailed steps
   - Use `project-docs/process/AI_PROMPT_TEMPLATE.md` for standard prompt formats

For more details, see [project-docs/process/DEVELOPMENT_PROCESS.md](project-docs/process/DEVELOPMENT_PROCESS.md)

## Command Line Options

```bash
Usage: @unctad-ai/create-ai-assisted-project [project-directory] [options]

Options:
  -V, --version                      Output version
  --template <n>                     Select project template
    [next-app, react-ts]
  
  --install                          Install dependencies (default: true)
  
  --pm <package-manager>             Choose package manager
    [npm, yarn, pnpm, bun]
  
  -h, --help                         Display help

Examples:
  # Create a Next.js App Router project (default)
  npx @unctad-ai/create-ai-assisted-project@latest my-app

  # Create a React TypeScript project with shadcn/ui
  npx @unctad-ai/create-ai-assisted-project@latest my-react-app --template react-ts
```

## Project Structure

```
my-app/
├── src/                   # Source code
│   ├── components/        # React components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions & shared code
│   ├── styles/            # Global styles and theme configuration
│   ├── context/           # React context providers
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   └── api/               # API client and related functionality
├── project-docs/          # Project documentation
│   ├── GETTING_STARTED.md # Quick onboarding guide
│   ├── guidelines/        # Development standards
│   │   ├── development.md # Development guidelines
│   │   └── review.md      # Review process
│   ├── process/           # Process documentation
│   │   ├── WORKFLOW.md    # Overview of development process
│   │   ├── DEVELOPMENT_PROCESS.md # Detailed workflow steps
│   │   └── AI_PROMPT_TEMPLATE.md # Standard AI prompts
│   └── technical/         # Technical documentation
│       ├── ARCHITECTURE.md # Architectural decisions
│       └── TECHNICAL_PLANNING.md # Implementation planning
├── memory.md              # Project memory file for AI context
├── todo.md                # Task tracking and management
├── package.json           # Project configuration
└── CLAUDE.md              # AI coding agent guidelines
```

For specific architecture recommendations, see [project-docs/technical/FOLDER_STRUCTURE.md](project-docs/technical/FOLDER_STRUCTURE.md)

## Best Practices

- **One Task Per Session**: Complete one task before starting another
- **Memory Management**: Update memory.md after each completed task
- **TDD Approach**: Write tests before implementation
- **Zero Tolerance**: Fix all warnings and errors before completing tasks
- **Clear Communication**: Use standard prompts from AI_PROMPT_TEMPLATE.md
- **Continuous Review**: Regularly review code with AI following review.md guidelines
- **Context Management**: Keep memory.md updated with all key decisions

## License

All rights reserved. No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the authors.
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

## Working with AI

### Step 1: Set Up Your Project

```bash
npx @unctad-ai/create-ai-assisted-project@latest my-app
cd my-app
npm install
```

### Step 2: Plan Your Project

First, instruct your AI coding assistant to read the guidelines:

```
Please read the AI_ASSISTANT.md file in this project to understand how to work with this codebase.
```

Then, ask it to help plan your project:

```
Help me plan this project: [brief description of your project idea].

Let's collaborate to define requirements, architecture, and create a task list.
```

The AI will guide you through creating project requirements, architecture, and tasks - writing all documentation directly to your project files in project-docs/ and creating your initial todo.md and memory.md files.

### Step 3: Implement

For each development cycle, ask:

```
Please read the AI_ASSISTANT.md file if you haven't already.

Let's implement the next task for this project. Use the documentation in project-docs/
and follow the implementation guidelines.
```

The AI will consult your project documentation, select the next logical task, and guide you through implementation.

### Additional Commands

- **Implement specific task:**
  ```
  Let's implement: [specific task from todo.md]
  ```

- **Review code:**
  ```
  Review this implementation: [component/feature]
  ```

- **Add feature:**
  ```
  Let's add a new feature: [feature description]
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
└── AI_ASSISTANT.md        # AI coding agent guidelines
```

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

## Best Practices

- **Simplified Prompts**: Keep AI instructions clear and concise
- **Memory Management**: Let AI update memory.md after each session
- **TDD Approach**: Follow test-driven development principles
- **One Task Focus**: Complete one focused task per AI session
- **Documentation First**: Let AI maintain documentation as you work

## License

All rights reserved. No part of this project may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the authors.
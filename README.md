# AI-Assisted Development Toolkit

This toolkit provides a comprehensive set of tools and workflows for AI-assisted software development. It's designed to streamline development using AI coding agents while maintaining high code quality and consistent practices, enabling developers to leverage AI throughout the entire development lifecycle.

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

You can use the built-in AI commands to start the planning process:

```bash
npm run ai:plan "Create a todo app with React"
```

This will update the memory.md file with your planning request and prepare the context for your AI assistant.

Then, instruct your AI coding assistant to read the guidelines:

```
Please read the AI_ASSISTANT.md file in this project to understand how to work with this codebase.
```

And continue with your planning request:

```
I've started planning a project to create a todo app with React. Let's collaborate to define requirements, architecture, and create a task list.
```

The AI will guide you through creating project requirements, architecture, and tasks - writing all documentation directly to your project files in project-docs/ and creating your initial todo.md and memory.md files.

### Step 3: Implement

For each development task, you can use the built-in AI commands to start the implementation process:

```bash
npm run ai:dev "task-1"
```

This will update the memory.md file with your implementation request and prepare the context for your AI assistant.

Then, in your AI assistant chat, ask:

```
Please read the AI_ASSISTANT.md file if you haven't already.

I've started implementing task-1. Let's work on this task together following the implementation guidelines.
```

The AI will consult your project documentation, retrieve the task details, and guide you through implementation.

### Step 4: Review

When you're ready to review your code, you can use the built-in AI command:

```bash
npm run ai:review
```

This will update the memory.md file with your review request and prepare the context for your AI assistant.

Then, in your AI assistant chat, ask:

```
Please review the code we've implemented so far and suggest any improvements.
```

The AI will analyze your codebase and provide feedback and suggestions for improvement.

### Additional AI Prompts

- **Implement specific task:**
  ```
  Let's implement: [specific task from todo.md]
  ```

- **Review specific code:**
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
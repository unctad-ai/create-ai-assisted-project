# Folder Structure Guidelines

This document outlines the recommended folder structure for projects created with this template.

## Core Project Structure

```
project-root/
├── project-docs/            # Project documentation
│   ├── GETTING_STARTED.md   # Quick onboarding guide
│   ├── guidelines/          # Development process guidelines
│   │   ├── development.md
│   │   └── review.md
│   ├── process/             # Workflow documentation
│   │   ├── DEVELOPMENT_PROCESS.md # Development workflow
│   │   ├── PROJECT_BRIEF.md     # Project requirements
│   │   ├── WORKFLOW.md          # Overall workflow overview
│   │   └── AI_PROMPT_TEMPLATE.md # Standard AI prompts
│   └── technical/           # Technical documentation
│       ├── ARCHITECTURE.md    # Architecture decisions
│       ├── TECHNICAL_PLAN.md  # Technical implementation details
│       ├── TECHNICAL_PLANNING.md # Planning guidelines
│       └── FOLDER_STRUCTURE.md # This file
├── memory.md                # Project state tracking for AI
├── todo.md                  # Task tracking with priorities
├── CLAUDE.md                # Guidelines for AI assistants
├── src/                     # Source code
├── tests/                   # Test files
└── README.md                # Project overview
```

## Source Code Organization

The `src/` directory is organized differently based on the chosen architecture.

### Domain-Driven Design (Recommended)

```
src/
├── domain/              # Core business logic & entities
│   ├── models/
│   └── services/
├── application/         # Use cases & application logic
│   ├── services/
│   └── interfaces/
├── infrastructure/      # External concerns (DB, API, etc.)
│   ├── database/
│   ├── api/
│   └── external/
└── presentation/        # UI components
    ├── components/
    ├── pages/
    └── hooks/
```

### Vertical Slice Architecture

```
src/
├── features/            # Each feature as self-contained unit
│   ├── feature1/
│   │   ├── components/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── tests/
│   └── feature2/
│       ├── ...
└── shared/              # Shared code across features
    ├── components/
    ├── hooks/
    └── utils/
```

### React/Next.js Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # Generic UI components
│   └── feature/         # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions, shared logic
├── pages/ or app/       # Next.js pages or App Router
├── styles/              # CSS/styling files
└── types/               # TypeScript type definitions
```

## Test Organization

```
tests/
├── unit/                # Unit tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
```

## Documentation

For each significant component, create appropriate documentation:
- README.md files in key directories explaining purpose
- Code comments for complex logic
- API documentation for public interfaces
- Test coverage reports

## Best Practices

1. Keep folder structure consistent with architectural decisions
2. Document any deviations from standard patterns
3. Limit folder nesting to 3-4 levels when possible
4. Use README.md files in key directories to explain purpose
5. Group related files together (component + test + styles)
6. Keep documentation close to related code
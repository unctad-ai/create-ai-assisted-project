# Implementation Instructions for AI Coding Agent

## Project Context
This is an AI-assisted development toolkit that helps developers work with AI coding assistants. The core components handle AI interaction, documentation generation, and development workflow management.

## Implementation Task
Implement the core system components following the TypeScript interfaces and architecture defined in the technical documentation. The system should be built as a Node.js package that can be published to npm.

## Key Files to Reference
- `project-docs/technical/IMPLEMENTATION_TASKS.md` - Component definitions and interfaces
- `project-docs/technical/TECHNICAL_SPEC.md` - Architecture and implementation details
- `project-docs/process/IMPLEMENTATION_GUIDE.md` - Step-by-step implementation guide
- `todo.md` - Prioritized task list

## Implementation Requirements

### 1. Code Standards
- Use TypeScript with strict mode enabled
- Follow provided interfaces exactly
- Implement comprehensive error handling
- Add JSDoc comments for all public APIs
- Maintain 100% test coverage
- Zero lint warnings/errors allowed

### 2. Implementation Order
1. AI Interaction Layer (`src/ai/`)
2. Documentation Generator (`src/docs/`)
3. Development Workflow (`src/workflow/`)
4. CLI Commands Integration (`src/commands/`)

### 3. Testing Requirements
- Unit tests for each component
- Integration tests for workflows
- Mock AI responses for testing
- Test error conditions and edge cases

### 4. Documentation Requirements
- Update implementation status in todo.md
- Add inline code documentation
- Create usage examples
- Document any technical decisions

## Getting Started

1. First implement the AI interaction layer:

```typescript
// src/ai/interaction.ts
export interface AIResponse {
  content: string;
  suggestions?: string[];
  files?: { path: string; content: string; }[];
}

export class AIInteractionManager {
  async planProject(description: string): Promise<AIResponse>;
  async implementTask(taskId: string): Promise<AIResponse>;
  async reviewCode(files: string[]): Promise<AIResponse>;
}
```

2. Then create the documentation generator:

```typescript
// src/docs/generator.ts
export interface DocGeneratorOptions {
  projectRoot: string;
  projectName: string;
  description: string;
}

export class DocumentationGenerator {
  async generateProjectBrief(description: string): Promise<void>;
  async generateTechnicalPlan(): Promise<void>;
  async updateTaskList(tasks: Task[]): Promise<void>;
  async updateMemory(changes: Change[]): Promise<void>;
}
```

3. Finally, implement the workflow manager:

```typescript
// src/workflow/index.ts
export interface WorkflowOptions {
  projectRoot: string;
  mode: 'plan' | 'dev' | 'review';
}

export class WorkflowManager {
  async startSession(): Promise<void>;
  async executeTask(taskId: string): Promise<void>;
  async completeTask(taskId: string): Promise<void>;
  async reviewChanges(): Promise<void>;
}
```

## Build Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

## Success Criteria
- All tests passing
- No TypeScript/lint errors
- All interfaces implemented
- Documentation complete
- Package publishable to npm

## Notes
- Use provided file structure
- Follow error handling patterns
- Maintain type safety
- Keep components loosely coupled
- Focus on developer experience

Start with the AI interaction layer and proceed through components in order. Update todo.md as you complete each task. Create comprehensive tests before implementing each component.
# AI Components Documentation

This document provides detailed information about the AI components implemented in this project.

## Overview

The AI-assisted development toolkit consists of several core components:

1. **AI Interaction Layer** - Manages communication with AI services
2. **Documentation Generator** - Creates and updates project documentation
3. **Development Workflow** - Orchestrates the development process
4. **CLI Commands Integration** - Provides command-line interface for AI interactions

## 1. AI Interaction Layer

The AI Interaction Layer is responsible for managing communication with AI services, formatting prompts, and processing responses.

### Key Components

#### AIInteractionManager

The `AIInteractionManager` class is the main entry point for AI interactions. It provides methods for planning projects, implementing tasks, and reviewing code.

```typescript
export class AIInteractionManager {
  constructor(options: AIInteractionOptions);
  async planProject(description: string): Promise<AIResponse>;
  async implementTask(taskId: string): Promise<AIResponse>;
  async reviewCode(files: string[]): Promise<AIResponse>;
}
```

#### PromptManager

The `PromptManager` class is responsible for building prompts for AI interactions. It reads prompt templates from the project and formats them with relevant context.

```typescript
export class PromptManager {
  constructor(projectRoot: string);
  async buildPlanningPrompt(description: string): Promise<string>;
  async buildImplementationPrompt(taskId: string, context: ProjectContext): Promise<string>;
  async buildReviewPrompt(files: string[]): Promise<string>;
}
```

#### ResponseProcessor

The `ResponseProcessor` class processes AI responses and applies changes to the project. It extracts file blocks, suggestions, and other content from the AI response.

```typescript
export class ResponseProcessor {
  constructor(projectRoot: string);
  processResponse(rawResponse: string): AIResponse;
  async applyChanges(response: AIResponse): Promise<string[]>;
}
```

## 2. Documentation Generator

The Documentation Generator is responsible for creating and updating project documentation based on AI interactions.

### Key Components

#### DocumentationGenerator

The `DocumentationGenerator` class is the main entry point for documentation generation. It provides methods for generating project briefs, technical plans, and updating task lists and memory files.

```typescript
export class DocumentationGenerator {
  constructor(options: DocGeneratorOptions);
  async generateProjectBrief(description: string): Promise<void>;
  async generateTechnicalPlan(): Promise<void>;
  async updateTaskList(tasks: Task[]): Promise<void>;
  async updateMemory(changes: Change[]): Promise<void>;
}
```

#### TemplateManager

The `TemplateManager` class is responsible for loading and processing document templates. It reads templates from the project and formats them with relevant context.

```typescript
export class TemplateManager {
  constructor(projectRoot: string);
  async loadTemplate(templateName: string): Promise<string>;
  processTemplate(template: string, variables: TemplateVariables): string;
}
```

## 3. Development Workflow

The Development Workflow is responsible for orchestrating the development process, managing tasks, and coordinating between components.

### Key Components

#### WorkflowManager

The `WorkflowManager` class is the main entry point for the development workflow. It provides methods for starting sessions, executing tasks, completing tasks, and reviewing changes.

```typescript
export class WorkflowManager {
  constructor(options: WorkflowOptions);
  async startSession(): Promise<void>;
  async executeTask(taskId: string): Promise<void>;
  async completeTask(taskId: string): Promise<void>;
  async reviewChanges(): Promise<void>;
}
```

#### TaskManager

The `TaskManager` class is responsible for managing tasks in the development workflow. It provides methods for getting tasks, updating task status, and adding new tasks.

```typescript
export class TaskManager {
  constructor(projectRoot: string);
  async getAllTasks(): Promise<Task[]>;
  async getTask(taskId: string): Promise<Task | undefined>;
  async updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'completed'): Promise<Task | undefined>;
  async addTask(task: Omit<Task, 'id'>): Promise<Task>;
}
```

## 4. CLI Commands Integration

The CLI Commands Integration is responsible for providing a command-line interface for AI interactions.

### Key Components

#### CommandExecutor

The `CommandExecutor` class is the main entry point for CLI commands. It provides methods for executing AI commands such as planning, development, and review.

```typescript
export class CommandExecutor {
  constructor(projectRoot: string);
  async execute(type: CommandType, input?: string): Promise<void>;
}
```

## Usage Examples

### Planning a Project

```typescript
import { AIInteractionManager } from './ai/interaction.js';

const aiManager = new AIInteractionManager({
  projectRoot: '/path/to/project'
});

const response = await aiManager.planProject('Create a todo app with React');
console.log(response.content);
```

### Implementing a Task

```typescript
import { WorkflowManager } from './workflow/index.js';

const workflowManager = new WorkflowManager({
  projectRoot: '/path/to/project',
  mode: 'dev'
});

await workflowManager.executeTask('task-1');
```

### Reviewing Code

```typescript
import { AIInteractionManager } from './ai/interaction.js';

const aiManager = new AIInteractionManager({
  projectRoot: '/path/to/project'
});

const response = await aiManager.reviewCode(['src/App.tsx', 'src/components/TodoList.tsx']);
console.log(response.content);
```

## Integration with Generated Projects

The AI components are integrated with generated projects through the `.ai/commands.js` script, which provides the following commands:

- `npm run ai:plan [description]` - Start planning a project
- `npm run ai:dev [taskId]` - Start implementing a task
- `npm run ai:review` - Start reviewing code

These commands update the memory.md file with the command execution and prepare the context for AI interactions.

## Extending the Components

### Adding New AI Services

To add support for a new AI service, you can extend the `AIInteractionManager` class and override the `sendToAI` method:

```typescript
export class CustomAIInteractionManager extends AIInteractionManager {
  protected async sendToAI(prompt: string): Promise<string> {
    // Implement custom AI service integration
    return 'Custom AI response';
  }
}
```

### Adding New Document Templates

To add new document templates, you can add them to the `src/docs/templates/` directory and update the `TemplateManager` class to support them:

```typescript
export class CustomTemplateManager extends TemplateManager {
  protected getTemplatePath(templateName: string): string {
    // Add support for new templates
    const templateMap: Record<string, string> = {
      ...super.getTemplateMap(),
      'CUSTOM_TEMPLATE': path.join(this.projectRoot, 'custom-template.md')
    };
    
    return templateMap[templateName] || path.join(this.projectRoot, `${templateName}.md`);
  }
}
```

### Adding New Workflow Modes

To add new workflow modes, you can update the `WorkflowManager` class to support them:

```typescript
export class CustomWorkflowManager extends WorkflowManager {
  async startSession(): Promise<void> {
    // Load context
    const context = await this.contextManager.load();
    
    // Update context with session info
    context.projectState.phase = this.sessionState.phase;
    await this.contextManager.save(context);
    
    // Handle different modes
    switch (this.options.mode) {
      case 'plan':
        await this.handlePlanning();
        break;
      case 'dev':
        await this.handleDevelopment();
        break;
      case 'review':
        await this.handleReview();
        break;
      case 'custom':
        await this.handleCustomMode();
        break;
    }
  }
  
  private async handleCustomMode(): Promise<void> {
    // Implement custom mode
  }
}
```

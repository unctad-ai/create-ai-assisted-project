import { ContextManager } from '../context/index.js';
import { WorkflowManager } from '../workflow/index.js';
import { AIInteractionManager } from '../ai/interaction.js';

export type CommandType = 'plan' | 'dev' | 'review';

/**
 * Executes AI-assisted development commands
 */
export class CommandExecutor {
  private projectRoot: string;
  private contextManager: ContextManager;

  /**
   * Creates a new CommandExecutor
   * @param projectRoot - Root directory of the project
   */
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.contextManager = new ContextManager(projectRoot);
  }

  /**
   * Executes a command
   * @param type - Type of command to execute
   * @param input - Optional input for the command
   */
  async execute(type: CommandType, input?: string): Promise<void> {
    // Create workflow manager for the command type
    const workflowManager = new WorkflowManager({
      projectRoot: this.projectRoot,
      mode: type
    });

    // Start the workflow session
    await workflowManager.startSession();

    // Handle specific command types
    switch(type) {
      case 'plan':
        return this.handlePlanning(workflowManager, input);
      case 'dev':
        return this.handleDevelopment(workflowManager, input);
      case 'review':
        return this.handleReview(workflowManager, input);
    }
  }

  /**
   * Handles planning mode
   * @param workflowManager - Workflow manager instance
   * @param description - Optional project description
   */
  private async handlePlanning(_workflowManager: WorkflowManager, description?: string): Promise<void> {
    console.log('Planning mode activated. AI assistant will help plan your project.');

    // Update context
    const context = await this.contextManager.load();
    context.projectState.phase = 'planning';
    context.recentChanges.push({
      timestamp: Date.now(),
      type: 'doc',
      description: `Started planning: ${description || 'No description provided'}`
    });
    await this.contextManager.save(context);

    // If description is provided, use AI to plan the project
    if (description) {
      const aiManager = new AIInteractionManager({
        projectRoot: this.projectRoot
      });

      await aiManager.planProject(description);
    }
  }

  /**
   * Handles development mode
   * @param workflowManager - Workflow manager instance
   * @param taskId - Optional task ID to implement
   */
  private async handleDevelopment(workflowManager: WorkflowManager, taskId?: string): Promise<void> {
    console.log('Development mode activated. AI assistant will help implement features.');

    // Update context
    const context = await this.contextManager.load();
    context.projectState.phase = 'development';
    await this.contextManager.save(context);

    // If task ID is provided, execute the task
    if (taskId) {
      await workflowManager.executeTask(taskId);
    }
  }

  /**
   * Handles review mode
   * @param workflowManager - Workflow manager instance
   * @param input - Optional input for review
   */
  private async handleReview(workflowManager: WorkflowManager, _input?: string): Promise<void> {
    console.log('Review mode activated. AI assistant will help review changes.');

    // Update context
    const context = await this.contextManager.load();
    context.projectState.phase = 'review';
    await this.contextManager.save(context);

    // Review changes
    await workflowManager.reviewChanges();
  }
}
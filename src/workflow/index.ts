import { ContextManager } from "../context/index.js";
import { AIInteractionManager } from "../ai/interaction.js";
import { DocumentationGenerator } from "../docs/generator.js";
import { TaskManager } from "./tasks.js";
import * as fs from "fs/promises";
import path from "path";
import { WorkflowOptions, SessionState, SessionChange } from "./types.js";
import { Task } from "../ai/types.js";

/**
 * Manages the development workflow
 */
export class WorkflowManager {
  private options: WorkflowOptions;
  private contextManager: ContextManager;
  private aiManager: AIInteractionManager;
  private docGenerator: DocumentationGenerator;
  private taskManager: TaskManager;
  private sessionState: SessionState;

  /**
   * Creates a new WorkflowManager
   * @param options - Options for the workflow
   */
  constructor(options: WorkflowOptions) {
    this.options = options;
    this.contextManager = new ContextManager(options.projectRoot);
    this.aiManager = new AIInteractionManager({
      projectRoot: options.projectRoot,
    });
    this.docGenerator = new DocumentationGenerator({
      projectRoot: options.projectRoot,
      projectName: path.basename(options.projectRoot),
      description: "",
    });
    this.taskManager = new TaskManager(options.projectRoot);

    // Initialize session state
    this.sessionState = {
      phase:
        options.mode === "plan"
          ? "planning"
          : options.mode === "dev"
            ? "development"
            : "review",
      startTime: Date.now(),
      changes: [],
    };
  }

  /**
   * Starts a new workflow session
   */
  async startSession(): Promise<void> {
    // Load context
    const context = await this.contextManager.load();

    // Update context with session info
    context.projectState.phase = this.sessionState.phase;
    await this.contextManager.save(context);

    // Handle different modes
    switch (this.options.mode) {
      case "plan":
        await this.handlePlanning();
        break;
      case "dev":
        await this.handleDevelopment();
        break;
      case "review":
        await this.handleReview();
        break;
    }
  }

  /**
   * Executes a specific task
   * @param taskId - ID of the task to execute
   */
  async executeTask(taskId: string): Promise<void> {
    // Get task details
    const task = await this.taskManager.getTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Update task status to in-progress
    await this.taskManager.updateTaskStatus(taskId, "in-progress");

    // Update session state
    this.sessionState.currentTask = task;
    this.sessionState.phase = "development";
    this.addSessionChange("task", taskId, `Started task: ${task.title}`);

    // Update context
    const context = await this.contextManager.load();
    context.currentTask = taskId;
    context.projectState.phase = "development";
    await this.contextManager.save(context);

    // Use AI to implement the task - pass the task ID as expected by the interface
    const response = await this.aiManager.implementTask(taskId);

    // Record changes
    if (response.files && response.files.length > 0) {
      for (const file of response.files) {
        this.addSessionChange("file", file.path, `Updated file: ${file.path}`);
      }
    }
  }

  /**
   * Completes a task
   * @param taskId - ID of the task to complete
   */
  async completeTask(taskId: string): Promise<void> {
    // Get task details
    const task = await this.taskManager.getTask(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Update task status to completed
    const updatedTask = await this.taskManager.updateTaskStatus(taskId, "completed") || {
      ...task,
      status: "completed"
    };

    // Update session state
    this.sessionState.currentTask = undefined;
    this.addSessionChange("task", taskId, `Completed task: ${task.title}`);

    // Update context
    const context = await this.contextManager.load();
    context.currentTask = "";
    context.recentChanges.unshift({
      timestamp: Date.now(),
      type: "feature",
      description: `Completed task: ${task.title}`,
    });
    await this.contextManager.save(context);

    // Update memory with changes - pass the changes array as expected by the interface
    await this.docGenerator.updateMemory(context.recentChanges);
  }

  /**
   * Reviews changes in the project
   */
  async reviewChanges(): Promise<void> {
    // Load context first to get recent changes
    const context = await this.contextManager.load();

    // Get list of changed files from session state
    const changedFiles = this.sessionState.changes
      .filter((change) => change.type === "file")
      .map((change) => change.path);

    if (changedFiles.length === 0) {
      console.log("No changes to review");
      // Still save context to maintain state
      await this.contextManager.save(context);
      return;
    }

    // Use AI to review the changes - pass the file paths array as expected by the interface
    const response = await this.aiManager.reviewCode(changedFiles);

    // Update session state
    this.sessionState.phase = "review";
    this.addSessionChange("doc", "review", "Reviewed changes");

    // Update context
    context.projectState.phase = "review";
    context.recentChanges.unshift({
      timestamp: Date.now(),
      type: "test",
      description: `Reviewed ${changedFiles.length} files`,
    });
    await this.contextManager.save(context);
  }

  /**
   * Handles planning mode
   */
  private async handlePlanning(): Promise<void> {
    console.log("Planning mode activated");

    // Get project description from package.json
    const description = await this.getProjectDescription();

    // Update doc generator with project description
    this.docGenerator = new DocumentationGenerator({
      projectRoot: this.options.projectRoot,
      projectName: path.basename(this.options.projectRoot),
      description,
    });

    // Generate initial documentation
    await this.docGenerator.generateProjectBrief(description);
    await this.docGenerator.generateTechnicalPlan();

    // Add session changes
    this.addSessionChange(
      "doc",
      "project-docs/process/PROJECT_BRIEF.md",
      "Generated project brief"
    );
    this.addSessionChange(
      "doc",
      "project-docs/technical/TECHNICAL_PLAN.md",
      "Generated technical plan"
    );
  }

  /**
   * Handles development mode
   */
  private async handleDevelopment(): Promise<void> {
    console.log("Development mode activated");

    // Get current task from context
    const context = await this.contextManager.load();
    if (context.currentTask) {
      const task = await this.taskManager.getTask(context.currentTask);
      if (task) {
        this.sessionState.currentTask = task;
        console.log(`Current task: ${task.title}`);
      }
    }
  }

  /**
   * Handles review mode
   */
  private async handleReview(): Promise<void> {
    console.log("Review mode activated");

    // Get list of files to review
    // This is a simplified implementation
    const filesToReview = await this.getFilesToReview();

    if (filesToReview.length === 0) {
      console.log("No files to review");
      return;
    }

    // Use AI to review the files
    await this.aiManager.reviewCode(filesToReview);

    // Add session change
    this.addSessionChange(
      "doc",
      "review",
      `Reviewed ${filesToReview.length} files`
    );
  }

  /**
   * Gets the project description from package.json
   * @returns Project description
   */
  private async getProjectDescription(): Promise<string> {
    try {
      const packageJsonPath = path.join(
        this.options.projectRoot,
        "package.json"
      );
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8")
      );
      return packageJson.description || "No description available";
    } catch (error) {
      return "No description available";
    }
  }

  /**
   * Gets a list of files to review
   * @returns List of files to review
   */
  private async getFilesToReview(): Promise<string[]> {
    // This is a simplified implementation
    // In a real implementation, you might use git to get changed files
    return [];
  }

  /**
   * Adds a change to the session state
   * @param type - Type of change
   * @param path - Path of the changed file or task ID
   * @param description - Description of the change
   */
  private addSessionChange(
    type: "file" | "task" | "doc",
    path: string,
    description: string
  ): void {
    this.sessionState.changes.push({
      type,
      path,
      description,
      timestamp: Date.now(),
    });
  }
}

import * as fs from "fs/promises";
import path from "path";
import { TemplateManager } from "./templates/index.js";
import { DocGeneratorOptions, TemplateVariables } from "./types.js";
import { Task } from "../ai/types.js";
import { Change } from "../context/index.js";

/**
 * Generates and updates project documentation
 */
export class DocumentationGenerator {
  private options: DocGeneratorOptions;
  private templateManager: TemplateManager;

  /**
   * Creates a new DocumentationGenerator
   * @param options - Options for document generation
   */
  constructor(options: DocGeneratorOptions) {
    this.options = options;
    this.templateManager = new TemplateManager(options.projectRoot);
  }

  /**
   * Generates a project brief document
   * @param description - Project description
   */
  async generateProjectBrief(description: string): Promise<void> {
    const template = await this.templateManager.loadTemplate("PROJECT_BRIEF");
    const variables = this.createBaseVariables();
    variables.description = description;

    const content = this.templateManager.processTemplate(template, variables);
    await this.writeDoc("project-docs/process/PROJECT_BRIEF.md", content);
  }

  /**
   * Generates a technical plan document
   */
  async generateTechnicalPlan(): Promise<void> {
    const template = await this.templateManager.loadTemplate("TECHNICAL_PLAN");
    const variables = this.createBaseVariables();

    const content = this.templateManager.processTemplate(template, variables);
    await this.writeDoc("project-docs/technical/TECHNICAL_PLAN.md", content);
  }

  /**
   * Updates the task list with new tasks
   * @param tasks - List of tasks to update
   */
  async updateTaskList(tasks: Task[]): Promise<void> {
    // Read existing todo.md if it exists
    let existingContent = "";
    try {
      existingContent = await fs.readFile(
        path.join(this.options.projectRoot, "todo.md"),
        "utf-8"
      );
    } catch (error) {
      // File doesn't exist, use default template
      existingContent = await this.templateManager.loadTemplate("TASK_LIST");
    }

    // Parse existing content to find sections
    const sections = this.parseTodoSections(existingContent);

    // Add new tasks to appropriate sections
    for (const task of tasks) {
      const taskLine = `- [ ] ${task.id}: ${task.title} - ${task.description}`;

      if (task.status === "todo") {
        if (task.priority === "high") {
          sections.highPriority.push(taskLine);
        } else if (task.priority === "medium") {
          sections.mediumPriority.push(taskLine);
        } else {
          sections.lowPriority.push(taskLine);
        }
      } else if (task.status === "in-progress") {
        sections.inProgress.push(taskLine);
      } else if (task.status === "completed") {
        sections.completed.push(taskLine);
      }
    }

    // Rebuild the todo.md content
    const newContent = this.buildTodoContent(sections);

    // Write the updated content
    await this.writeDoc("todo.md", newContent);
  }

  /**
   * Updates the memory file with recent changes
   * @param changes - List of recent changes
   */
  async updateMemory(changes: Change[]): Promise<void> {
    // Read existing memory.md if it exists
    let existingContent = "";
    try {
      existingContent = await fs.readFile(
        path.join(this.options.projectRoot, "memory.md"),
        "utf-8"
      );
    } catch (error) {
      // File doesn't exist, use default template
      existingContent = await this.templateManager.loadTemplate("MEMORY");
    }

    // Extract project state from existing content
    const stateMatch = existingContent.match(
      /## Project State\s*```(?:json)?\s*([\s\S]*?)```/i
    );
    const projectState = stateMatch ? stateMatch[1].trim() : "{}";

    // Build new memory content
    const newContent = `# Memory File

## Project State
\`\`\`json
${projectState}
\`\`\`

## Recent Changes
${changes.map((c) => `- ${new Date(c.timestamp).toISOString()}: ${c.description}`).join("\n")}
`;

    // Write the updated content
    await this.writeDoc("memory.md", newContent);
  }

  /**
   * Creates base template variables
   * @returns Base template variables
   */
  private createBaseVariables(): TemplateVariables {
    return {
      projectName: this.options.projectName,
      description: this.options.description,
      date: new Date().toISOString().split("T")[0],
    };
  }

  /**
   * Writes a document to the project
   * @param relativePath - Path relative to project root
   * @param content - Document content
   */
  private async writeDoc(relativePath: string, content: string): Promise<void> {
    const filePath = path.join(this.options.projectRoot, relativePath);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });

    // Write file
    await fs.writeFile(filePath, content);
  }

  /**
   * Parses todo.md into sections
   * @param content - Content of todo.md
   * @returns Parsed sections
   */
  private parseTodoSections(content: string): {
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
    inProgress: string[];
    completed: string[];
    header: string;
    footer: string;
  } {
    const sections = {
      highPriority: [] as string[],
      mediumPriority: [] as string[],
      lowPriority: [] as string[],
      inProgress: [] as string[],
      completed: [] as string[],
      header: "",
      footer: "",
    };

    // Extract sections using regex
    const headerMatch = content.match(/^([\s\S]*?)## Active Tasks/i);
    sections.header = headerMatch
      ? headerMatch[1]
      : "# Project Todo List\n\nThis file tracks tasks for AI-assisted development. AI agents should update this file after completing each task.\n\n";

    const highPriorityMatch = content.match(
      /### High Priority\s*([\s\S]*?)(?=###|## In Progress|## Completed|## Notes|$)/i
    );
    if (highPriorityMatch) {
      sections.highPriority = highPriorityMatch[1]
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
    }

    const mediumPriorityMatch = content.match(
      /### Medium Priority\s*([\s\S]*?)(?=###|## In Progress|## Completed|## Notes|$)/i
    );
    if (mediumPriorityMatch) {
      sections.mediumPriority = mediumPriorityMatch[1]
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
    }

    const lowPriorityMatch = content.match(
      /### Low Priority\s*([\s\S]*?)(?=###|## In Progress|## Completed|## Notes|$)/i
    );
    if (lowPriorityMatch) {
      sections.lowPriority = lowPriorityMatch[1]
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
    }

    const inProgressMatch = content.match(
      /## In Progress\s*([\s\S]*?)(?=## Completed|## Notes|$)/i
    );
    if (inProgressMatch) {
      sections.inProgress = inProgressMatch[1]
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
    }

    const completedMatch = content.match(
      /## Completed\s*([\s\S]*?)(?=## Notes|$)/i
    );
    if (completedMatch) {
      sections.completed = completedMatch[1]
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));
    }

    const footerMatch = content.match(/## Notes for AI\s*([\s\S]*)$/i);
    sections.footer = footerMatch ? `## Notes for AI\n${footerMatch[1]}` : "";

    return sections;
  }

  /**
   * Builds todo.md content from sections
   * @param sections - Parsed sections
   * @returns Rebuilt todo.md content
   */
  private buildTodoContent(sections: {
    highPriority: string[];
    mediumPriority: string[];
    lowPriority: string[];
    inProgress: string[];
    completed: string[];
    header: string;
    footer: string;
  }): string {
    return `${sections.header}
## Active Tasks

### High Priority
${sections.highPriority.join("\n")}

### Medium Priority
${sections.mediumPriority.join("\n")}

### Low Priority
${sections.lowPriority.join("\n")}

## In Progress
${sections.inProgress.join("\n")}

## Completed
${sections.completed.join("\n")}

${sections.footer}`;
  }
}

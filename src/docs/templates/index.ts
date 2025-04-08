import * as fs from "fs/promises";
import path from "path";
import type { TemplateVariables } from "../types.js";

/**
 * Manages document templates
 */
export class TemplateManager {
  private projectRoot: string;
  private templateCache: Map<string, string> = new Map();

  /**
   * Creates a new TemplateManager
   * @param projectRoot - Root directory of the project
   */
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Loads a template from the project
   * @param templateName - Name of the template to load
   * @returns Template content
   */
  async loadTemplate(templateName: string): Promise<string> {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    // Try to load from project-docs
    try {
      const templatePath = this.getTemplatePath(templateName);
      const content = await fs.readFile(templatePath, "utf-8");
      this.templateCache.set(templateName, content);
      return content;
    } catch (error) {
      // If not found, use default template
      const defaultTemplate = this.getDefaultTemplate(templateName);
      this.templateCache.set(templateName, defaultTemplate);
      return defaultTemplate;
    }
  }

  /**
   * Processes a template with variables
   * @param template - Template content
   * @param variables - Variables to replace in the template
   * @returns Processed template
   */
  processTemplate(template: string, variables: TemplateVariables): string {
    let processed = template;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(
        `\\[${key}\\]|\\{\\{\\s*${key}\\s*\\}\\}`,
        "g"
      );

      if (typeof value === "object") {
        processed = processed.replace(
          placeholder,
          JSON.stringify(value, null, 2)
        );
      } else {
        processed = processed.replace(placeholder, String(value));
      }
    }

    // Replace any remaining placeholders with empty strings
    processed = processed.replace(/\[\w+\]|\{\{\s*\w+\s*\}\}/g, "");

    return processed;
  }

  /**
   * Gets the path to a template file
   * @param templateName - Name of the template
   * @returns Path to the template file
   */
  private getTemplatePath(templateName: string): string {
    // Map template names to file paths
    const templateMap: Record<string, string> = {
      PROJECT_BRIEF: path.join(
        this.projectRoot,
        "project-docs",
        "process",
        "PROJECT_BRIEF.md"
      ),
      TECHNICAL_PLAN: path.join(
        this.projectRoot,
        "project-docs",
        "technical",
        "TECHNICAL_PLAN.md"
      ),
      TASK_LIST: path.join(this.projectRoot, "todo.md"),
      MEMORY: path.join(this.projectRoot, "memory.md"),
    };

    return (
      templateMap[templateName] ||
      path.join(this.projectRoot, `${templateName}.md`)
    );
  }

  /**
   * Gets a default template for a given template name
   * @param templateName - Name of the template
   * @returns Default template content
   */
  private getDefaultTemplate(templateName: string): string {
    // Default templates for common documents
    const defaultTemplates: Record<string, string> = {
      PROJECT_BRIEF: `# Project Brief

[description]

[projectName]`,
      TECHNICAL_PLAN: `# Technical Implementation Plan

## Data Models

\`\`\`typescript
// Define your data models here
\`\`\`

## API/Interface Definitions

\`\`\`typescript
// Define your APIs and interfaces here
\`\`\`

## Component Structure

## Libraries and Dependencies

## Architecture Decisions

## Implementation Sequence

## Testing Strategy
`,
      TASK_LIST: `# Project Todo List

This file tracks tasks for AI-assisted development. AI agents should update this file after completing each task.

## Active Tasks

### High Priority
- [ ] Task 1
- [ ] Task 2

### Medium Priority
- [ ] Task 3
- [ ] Task 4

### Low Priority
- [ ] Task 5
- [ ] Task 6

## In Progress

## Completed

## Notes for AI
- Update this file by marking tasks as completed [X] when done
- Move tasks between sections as their status changes
- Each task should have clear acceptance criteria
`,
      MEMORY: `# Memory File

## Project State
{
  "phase": "planning",
  "features": [],
  "progress": 0
}

## Recent Changes
- Project initialized
`,
      UNKNOWN: `# [title]

[content]`
    };

    return (
      defaultTemplates[templateName] ||
      defaultTemplates["UNKNOWN"] ||
      `# ${templateName}\n\nThis is a default template.`
    );
  }
}

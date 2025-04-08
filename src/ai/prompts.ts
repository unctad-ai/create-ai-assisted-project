import * as fs from "fs/promises";
import path from "path";
import type { ProjectContext } from "../context/index.js";

/**
 * Manages prompt templates for AI interactions
 */
export class PromptManager {
  private projectRoot: string;

  /**
   * Creates a new PromptManager
   * @param projectRoot - Root directory of the project
   */
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Builds a planning prompt for project initialization
   * @param description - Project description
   * @returns Formatted prompt for planning
   */
  async buildPlanningPrompt(description: string): Promise<string> {
    const assistantGuide = await this.readAssistantGuide();
    const promptTemplate = await this.readPromptTemplate("planning");

    return `
${assistantGuide}

# Project Planning Request

${promptTemplate}

## Project Description
${description}

Please help plan this project following the guidelines in AI_ASSISTANT.md.
`;
  }

  /**
   * Builds an implementation prompt for a specific task
   * @param taskId - ID of the task to implement
   * @param context - Current project context
   * @returns Formatted prompt for implementation
   */
  async buildImplementationPrompt(
    taskId: string,
    context: ProjectContext
  ): Promise<string> {
    const assistantGuide = await this.readAssistantGuide();
    const promptTemplate = await this.readPromptTemplate("implementation");
    const taskDetails = await this.getTaskDetails(taskId);
    const relevantFiles = await this.getRelevantFiles(taskId);

    return `
${assistantGuide}

# Implementation Request

${promptTemplate}

## Current Task
${taskDetails}

## Project Context
${JSON.stringify(context, null, 2)}

## Relevant Files
${relevantFiles}

Please implement this task following the guidelines in AI_ASSISTANT.md.
`;
  }

  /**
   * Builds a code review prompt
   * @param files - List of files to review
   * @returns Formatted prompt for code review
   */
  async buildReviewPrompt(files: string[]): Promise<string> {
    const assistantGuide = await this.readAssistantGuide();
    const promptTemplate = await this.readPromptTemplate("review");
    const fileContents = await this.getFileContents(files);

    return `
${assistantGuide}

# Code Review Request

${promptTemplate}

## Files to Review
${fileContents}

Please review these files following the guidelines in AI_ASSISTANT.md.
`;
  }

  /**
   * Reads the AI assistant guide file
   * @returns Content of the AI assistant guide
   */
  private async readAssistantGuide(): Promise<string> {
    try {
      return await fs.readFile(
        path.join(this.projectRoot, "AI_ASSISTANT.md"),
        "utf-8"
      );
    } catch (error) {
      console.warn("AI_ASSISTANT.md not found, using default guide");
      return "# AI Assistant Guidelines\n\nPlease help with this project following best practices.";
    }
  }

  /**
   * Reads a prompt template from the project
   * @param type - Type of prompt template to read
   * @returns Content of the prompt template
   */
  private async readPromptTemplate(
    type: "planning" | "implementation" | "review"
  ): Promise<string> {
    try {
      const templatePath = path.join(
        this.projectRoot,
        "project-docs",
        "process",
        "AI_PROMPT_TEMPLATE.md"
      );
      const content = await fs.readFile(templatePath, "utf-8");

      // Extract the relevant section based on type
      if (type === "planning") {
        return this.extractSection(content, "Planning Phase Prompt");
      } else if (type === "implementation") {
        return this.extractSection(content, "Implementation Phase Prompt");
      } else {
        return this.extractSection(content, "Review Prompt");
      }
    } catch (error) {
      console.warn(`Prompt template not found for ${type}, using default`);
      return `Let's work on this ${type} task together.`;
    }
  }

  /**
   * Extracts a section from a markdown document
   * @param content - Full markdown content
   * @param sectionTitle - Title of the section to extract
   * @returns Extracted section content
   */
  private extractSection(content: string, sectionTitle: string): string {
    const sectionRegex = new RegExp(
      `### ${sectionTitle}\\s*\`\`\`\\s*([\\s\\S]*?)\\s*\`\`\``,
      "i"
    );
    const match = content.match(sectionRegex);
    return match ? match[1].trim() : `Let's work on this task together.`;
  }

  /**
   * Gets details for a specific task
   * @param taskId - ID of the task
   * @returns Task details as a string
   */
  private async getTaskDetails(taskId: string): Promise<string> {
    try {
      const todoPath = path.join(this.projectRoot, "todo.md");
      const content = await fs.readFile(todoPath, "utf-8");

      // Simple regex to find the task by ID or title containing the ID
      const taskRegex = new RegExp(`- \\[([ X])\\]\\s*(.+${taskId}.+)`, "i");
      const match = content.match(taskRegex);

      return match ? match[2].trim() : `Task ID: ${taskId} (details not found)`;
    } catch (error) {
      return `Task ID: ${taskId} (todo.md not found)`;
    }
  }

  /**
   * Gets relevant files for a task
   * @param taskId - ID of the task
   * @returns List of relevant files as a string
   */
  private async getRelevantFiles(taskId: string): Promise<string> {
    // This is a simplified implementation
    // In a real implementation, you might use more sophisticated methods to determine relevant files
    return "Relevant files will be determined during the implementation.";
  }

  /**
   * Gets the contents of specified files
   * @param files - List of file paths
   * @returns File contents as a formatted string
   */
  private async getFileContents(files: string[]): Promise<string> {
    const contents: string[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(this.projectRoot, file);
        const content = await fs.readFile(filePath, "utf-8");
        contents.push(`### ${file}\n\`\`\`\n${content}\n\`\`\``);
      } catch (error) {
        contents.push(`### ${file}\nFile not found or cannot be read.`);
      }
    }

    return contents.join("\n\n");
  }
}

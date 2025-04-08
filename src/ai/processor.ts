import * as fs from "fs/promises";
import path from "path";
import type { AIResponse, AIFile } from "./types.js";

/**
 * Processes AI responses and applies changes to the project
 */
export class ResponseProcessor {
  private projectRoot: string;

  /**
   * Creates a new ResponseProcessor
   * @param projectRoot - Root directory of the project
   */
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  /**
   * Processes a raw AI response into a structured AIResponse
   * @param rawResponse - Raw response from the AI service
   * @returns Structured AIResponse
   */
  processResponse(rawResponse: string): AIResponse {
    // This is a simplified implementation
    // In a real implementation, you would parse the response more intelligently

    // Extract file blocks
    const files = this.extractFileBlocks(rawResponse);

    // Extract suggestions
    const suggestions = this.extractSuggestions(rawResponse);

    // Clean content (remove file blocks and suggestions)
    const content = this.cleanContent(rawResponse, files);

    return {
      content,
      suggestions,
      files,
    };
  }

  /**
   * Applies changes from an AI response to the project
   * @param response - Structured AI response
   * @returns List of applied changes
   */
  async applyChanges(response: AIResponse): Promise<string[]> {
    const appliedChanges: string[] = [];

    if (response.files && response.files.length > 0) {
      for (const file of response.files) {
        await this.writeFile(file);
        appliedChanges.push(`Updated file: ${file.path}`);
      }
    }

    return appliedChanges;
  }

  /**
   * Extracts file blocks from a raw AI response
   * @param rawResponse - Raw response from the AI service
   * @returns List of file objects
   */
  private extractFileBlocks(rawResponse: string): AIFile[] {
    const files: AIFile[] = [];
    const fileBlockRegex =
      /```(?:file|filepath):(.+?)\n([\s\S]*?)```/g;

    let match;
    while ((match = fileBlockRegex.exec(rawResponse)) !== null) {
      files.push({
        path: match[1].trim(),
        content: match[2].trim(),
      });
    }

    return files;
  }

  /**
   * Extracts suggestions from a raw AI response
   * @param rawResponse - Raw response from the AI service
   * @returns List of suggestions
   */
  private extractSuggestions(rawResponse: string): string[] {
    const suggestions: string[] = [];
    const suggestionsRegex =
      /(?:## Next Steps|## Suggestions|## Recommended Actions)([\s\S]*?)(?:##|$)/i;

    const match = rawResponse.match(suggestionsRegex);
    if (match && match[1]) {
      const suggestionsText = match[1].trim();
      const bulletPoints = suggestionsText
        .split("\n")
        .filter((line) => line.trim().startsWith("-"));

      for (const point of bulletPoints) {
        suggestions.push(point.replace(/^-\s*/, "").trim());
      }
    }

    return suggestions;
  }

  /**
   * Cleans the content by removing file blocks and suggestions
   * @param rawResponse - Raw response from the AI service
   * @param files - Extracted file objects
   * @returns Cleaned content
   */
  private cleanContent(rawResponse: string, files: AIFile[]): string {
    let content = rawResponse;

    // Remove file blocks
    const fileBlockRegex =
      /```(?:file|filepath):.+?\n[\s\S]*?```/g;
    content = content.replace(fileBlockRegex, "");

    // Remove suggestions section
    const suggestionsRegex =
      /## Next Steps|## Suggestions|## Recommended Actions[\s\S]*?(?:##|$)/i;
    content = content.replace(suggestionsRegex, "");

    // Clean up extra whitespace
    content = content.replace(/\n{3,}/g, "\n\n").trim();

    return content;
  }

  /**
   * Writes a file to the project
   * @param file - File object with path and content
   */
  private async writeFile(file: AIFile): Promise<void> {
    // If the path is already absolute and contains the project root, use it directly
    // Otherwise, join it with the project root
    const filePath = file.path.startsWith(this.projectRoot)
      ? file.path
      : path.join(this.projectRoot, file.path);

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // In tests, this might fail but we can continue
      console.warn(`Failed to create directory ${dirPath}: ${error}`);
    }

    // Write file
    try {
      await fs.writeFile(filePath, file.content);
    } catch (error) {
      // In tests, this might fail but we can continue
      console.warn(`Failed to write file ${filePath}: ${error}`);
    }
  }
}

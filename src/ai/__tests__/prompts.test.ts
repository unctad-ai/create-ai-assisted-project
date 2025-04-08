// import fs from 'fs/promises'; // REMOVED - Use global mocks
import path from "path";
import { PromptManager } from "../prompts.js";
import { mockReadFile } from "../../__tests__/setup.js"; // Import needed mocks
import type { ProjectContext } from "../../context"; // Corrected import path
import { jest } from "@jest/globals";

// REMOVED Local fs/promises mock block
// // Mock fs/promises
// jest.mock("fs/promises", () => ({
//   readFile: jest
//     .fn()
//     .mockImplementation((filePath: any) => Promise.resolve("")),
// }));

describe("PromptManager", () => {
  let manager: PromptManager; // Renamed from promptManager for clarity
  const mockProjectRoot = "/test/project";

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new PromptManager(mockProjectRoot); // Use renamed variable

    // REMOVED redundant mock implementation block
    // // Mock readFile for different files
    // (fs.readFile as jest.Mock).mockImplementation((filePath: any) => {
    //   ...
    // });
  });

  describe("buildPlanningPrompt", () => {
    it("should build a planning prompt with description", async () => {
      const description = "Test project";
      // Ensure mockReadFile returns the AI_ASSISTANT content
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("AI_ASSISTANT.md")) {
          return "# AI Assistant Guidelines\n\n## Project Planning Process\n[Planning details]";
        }
        if (p.endsWith("PLANNING_PROMPT.md")) {
          return "Plan this: {{description}}\nGuidelines: {{guidelines}}";
        }
        return "";
      });

      const prompt = await manager.buildPlanningPrompt(description);

      expect(prompt).toContain("# AI Assistant Guidelines");
      expect(prompt).toContain("Plan this: Test project");
      expect(prompt).toContain("Guidelines: [Planning details]");
    });

    it("should handle missing AI_ASSISTANT.md", async () => {
      const description = "Test project";
      // Mock readFile to simulate missing AI_ASSISTANT.md
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("PLANNING_PROMPT.md")) {
          return "Plan this: {{description}}\nGuidelines: {{guidelines}}";
        }
        // Simulate file not found for AI_ASSISTANT.md
        throw new Error("File not found");
      });

      const prompt = await manager.buildPlanningPrompt(description);

      expect(prompt).toContain("Plan this: Test project");
      expect(prompt).toContain("Guidelines: ");
    });

    it("should handle missing prompt template", async () => {
      const description = "Test project";
      // Mock readFile to simulate missing template
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("AI_ASSISTANT.md")) {
          return "# AI Assistant Guidelines";
        }
        // Simulate file not found for template
        throw new Error("File not found");
      });

      await expect(manager.buildPlanningPrompt(description)).rejects.toThrow(
        "File not found"
      );
    });
  });

  describe("buildImplementationPrompt", () => {
    it("should build an implementation prompt with task ID and context", async () => {
      const taskId = "task-1";
      const context = {
        currentTask: "",
        projectState: {
          phase: "development" as "development" | "planning" | "review",
          features: [],
          progress: 0,
        },
        recentChanges: [],
      };

      const result = await manager.buildImplementationPrompt(taskId, context);

      expect(result).toContain("# AI Assistant Guidelines");
      expect(result).toContain("Help me implement this task");
      expect(result).toContain("task-1: Test Task - Test Description");
      expect(result).toContain(JSON.stringify(context, null, 2));
    });

    it("should handle missing task details", async () => {
      const taskId = "task-1";
      // Mock readFile for AI_ASSISTANT, todo.md (task not found), and IMPLEMENTATION_PROMPT
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("AI_ASSISTANT.md")) {
          return "# AI Assistant Guidelines\n\n## Implementation Process\n[Implementation details]";
        }
        if (p.endsWith("todo.md")) {
          return "## Active Tasks\n### High Priority\n- [ ] task-2: Another Task - Another Description";
        }
        if (p.endsWith("IMPLEMENTATION_PROMPT.md")) {
          return "Implement this task: {{taskId}}\nGuidelines: {{guidelines}}";
        }
        throw new Error("File not found");
      });

      const context = {
        currentTask: "",
        projectState: {
          phase: "development" as "development" | "planning" | "review",
          features: [],
          progress: 0,
        },
        recentChanges: [],
      };

      const result = await manager.buildImplementationPrompt(taskId, context);

      expect(result).toContain("# AI Assistant Guidelines");
      expect(result).toContain("Implement this task: task-1");
      expect(result).toContain("Guidelines: [Implementation details]");
    });
  });

  describe("buildReviewPrompt", () => {
    it("should build a review prompt with files", async () => {
      const files = ["src/index.ts", "src/utils.ts"];
      // Mock readFile for REVIEW_PROMPT template and file contents
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("REVIEW_PROMPT.md")) {
          return "Review these files:\n{{#files}}{{path}}: {{content}}{{/files}}";
        }
        if (p.endsWith("src/index.ts")) {
          return "console.log('Hello, world!');";
        }
        if (p.endsWith("src/utils.ts")) {
          return "export function add(a: number, b: number) { return a + b; }";
        }
        throw new Error("File not found");
      });

      const result = await manager.buildReviewPrompt(files);

      expect(result).toContain("Review these files:");
      expect(result).toContain("src/index.ts: console.log('Hello, world!');");
      expect(result).toContain(
        "src/utils.ts: export function add(a: number, b: number) { return a + b; }"
      );
    });

    it("should handle missing files", async () => {
      const files = ["src/missing.ts"];
      // Mock readFile to simulate missing file
      mockReadFile.mockImplementation(async (filePath) => {
        // Use mockReadFile
        const p = String(filePath);
        if (p.endsWith("REVIEW_PROMPT.md")) {
          return "Review: {{#files}}{{path}}: {{content}}{{/files}}";
        }
        // Simulate file not found
        throw new Error("File not found");
      });

      const prompt = await manager.buildReviewPrompt(files);

      expect(prompt).toContain("Review:");
      expect(prompt).toContain(
        "src/missing.ts: File not found or cannot be read"
      );
    });
  });

  describe("extractSection", () => {
    it("should extract a section from markdown content", () => {
      const content = "# Section 1\nContent 1\n## Section 2\nContent 2";
      const result = (manager as any).extractSection(content, "Section 2");
      expect(result).toBe("Content 2");
    });

    it("should return default message when section is not found", () => {
      const content = "# Section 1\nContent 1";
      const result = (manager as any).extractSection(
        content,
        "Section 3",
        "Not Found"
      );
      expect(result).toBe("Not Found");
    });
  });
});

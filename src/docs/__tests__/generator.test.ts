import { DocumentationGenerator } from "../generator.js";
import { TemplateManager } from "../templates/index.js"; // Regular import
// Removed fs import, rely on global setup
import path from "path";
import { jest } from "@jest/globals";
import {
  mockReadFile,
  mockWriteFile,
  mockMkdir,
} from "../../__tests__/setup.js";

// Use standard jest.mock with .js extension
const mockTemplateLoad = jest.fn<() => Promise<string>>();
const mockTemplateProcess = jest.fn<(...args: any[]) => string>();

jest.mock("../templates/index", () => ({
  TemplateManager: jest.fn().mockImplementation(() => ({
    loadTemplate: mockTemplateLoad,
    processTemplate: mockTemplateProcess,
  })),
}));

// Removed unstable_mockModule and await import

describe("DocumentationGenerator", () => {
  let docGenerator: DocumentationGenerator;
  const mockProjectRoot = "/test/project";
  const mockProjectName = "test-project";
  const mockDescription = "Test project description";

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset specific mock implementations for TemplateManager
    mockTemplateLoad.mockClear().mockResolvedValue("Default template content");
    mockTemplateProcess
      .mockClear()
      .mockImplementation((template: string, vars: Record<string, any>) => {
        let processed = template;
        if (vars) {
          for (const key in vars) {
            processed = processed.replace(`[${key}]`, String(vars[key]));
          }
        }
        return processed;
      });

    // Reset global fs mock implementations (already imported)
    mockMkdir.mockClear().mockResolvedValue(undefined);
    mockWriteFile.mockClear().mockResolvedValue(undefined);
    mockReadFile.mockClear().mockResolvedValue("");

    // Create DocumentationGenerator instance
    docGenerator = new DocumentationGenerator({
      projectRoot: mockProjectRoot,
      projectName: mockProjectName,
      description: mockDescription,
    });
  });

  describe("generateProjectBrief", () => {
    it("should generate a project brief document", async () => {
      const description = "Test project description";
      const templateContent = "# [projectName]\n[description]";
      // Override the mock implementation for this specific test case
      mockTemplateLoad.mockResolvedValueOnce(templateContent);

      await docGenerator.generateProjectBrief(description);

      // Verify template was loaded
      expect(mockTemplateLoad).toHaveBeenCalledWith("PROJECT_BRIEF");
      // Verify template was processed with description
      expect(mockTemplateProcess).toHaveBeenCalledWith(
        templateContent,
        expect.objectContaining({ description })
      );
      // Verify directory was created
      expect(mockMkdir).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "project-docs", "process"),
        { recursive: true }
      );
      // Verify file was written
      expect(mockWriteFile).toHaveBeenCalledWith(
        path.join(
          mockProjectRoot,
          "project-docs",
          "process",
          "PROJECT_BRIEF.md"
        ),
        expect.any(String)
      );
    });
  });

  describe("generateTechnicalPlan", () => {
    it("should generate a technical plan document", async () => {
      const templateContent = "# Plan for [projectName]";
      // Override the mock implementation for this specific test case
      mockTemplateLoad.mockResolvedValueOnce(templateContent);

      await docGenerator.generateTechnicalPlan();

      // Verify template was loaded
      expect(mockTemplateLoad).toHaveBeenCalledWith("TECHNICAL_PLAN");
      // Verify template was processed
      expect(mockTemplateProcess).toHaveBeenCalledWith(
        templateContent,
        expect.any(Object)
      );
      // Verify directory was created
      expect(mockMkdir).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "project-docs", "technical"),
        { recursive: true }
      );
      // Verify file was written
      expect(mockWriteFile).toHaveBeenCalledWith(
        path.join(
          mockProjectRoot,
          "project-docs",
          "technical",
          "TECHNICAL_PLAN.md"
        ),
        expect.any(String)
      );
    });
  });

  describe("updateTaskList", () => {
    it("should update the task list with new tasks", async () => {
      const tasks = [
        {
          id: "task-2",
          title: "New Task",
          description: "New task description",
          priority: "high" as const,
          status: "todo" as const,
        },
      ];

      await docGenerator.updateTaskList(tasks);

      // Verify file was read
      expect(mockReadFile).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "todo.md"),
        "utf-8"
      );

      // Verify directory was created
      expect(mockMkdir).toHaveBeenCalledWith(
        path.dirname(path.join(mockProjectRoot, "todo.md")),
        { recursive: true }
      );

      // Verify file was written
      expect(mockWriteFile).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "todo.md"),
        expect.any(String)
      );
    });
  });

  describe("updateMemory", () => {
    it("should update the memory file with recent changes", async () => {
      const changes = [
        {
          timestamp: Date.now(),
          type: "feature" as const,
          description: "New feature added",
        },
      ];

      await docGenerator.updateMemory(changes);

      // Verify file was read
      expect(mockReadFile).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "memory.md"),
        "utf-8"
      );

      // Verify directory was created
      expect(mockMkdir).toHaveBeenCalledWith(
        path.dirname(path.join(mockProjectRoot, "memory.md")),
        { recursive: true }
      );

      // Verify file was written
      expect(mockWriteFile).toHaveBeenCalledWith(
        path.join(mockProjectRoot, "memory.md"),
        expect.any(String)
      );
    });
  });
});

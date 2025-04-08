import { TemplateManager } from "../templates/index.js";
// import { setupFsMocks } from "../../__tests__/setup.js"; // REMOVED - Not needed
import { mockReadFile } from "../../__tests__/setup.js"; // Use exported mocks directly
import { jest } from "@jest/globals";
import type { TemplateVariables } from "../types.js";
import * as fs from "fs/promises";

// Mock fs/promises
jest.mock("fs/promises");

describe("TemplateManager", () => {
  let templateManager: TemplateManager;
  let fsMocks: { mockReadFile: jest.Mock }; // Keep type if needed

  beforeEach(() => {
    // setupFsMocks(); // REMOVED
    templateManager = new TemplateManager("/test/project");
    // Clear mocks defined in setup.ts if necessary (usually done in setup.ts itself)
    mockReadFile.mockClear();
    mockReadFile.mockResolvedValue("# Project Brief\n\n[description]\n\n[projectName]");

    // Ensure fs.readFile is properly mocked
    (fs.readFile as jest.Mock) = mockReadFile;
  });

  describe("loadTemplate", () => {
    it("should load a template from the project", async () => {
      const template = await templateManager.loadTemplate("PROJECT_BRIEF");
      expect(template).toBe(
        "# Project Brief\n\n[description]\n\n[projectName]"
      );
      expect(mockReadFile).toHaveBeenCalledTimes(1);
    });

    it("should use default template when file is not found", async () => {
      mockReadFile.mockRejectedValue(new Error("File not found")); // Use imported mock
      const template = await templateManager.loadTemplate("MISSING_TEMPLATE");
      // Expect generic default or specific default based on getDefaultTemplate logic
      expect(template).toContain("This is a default template"); // Assuming generic default
      expect(mockReadFile).toHaveBeenCalledTimes(1);
    });

    it("should cache templates", async () => {
      mockReadFile.mockResolvedValue("Template Content"); // Use imported mock
      await templateManager.loadTemplate("CACHED_TEMPLATE");
      await templateManager.loadTemplate("CACHED_TEMPLATE");
      expect(mockReadFile).toHaveBeenCalledTimes(1); // Should only be called once
    });
  });

  describe("processTemplate", () => {
    it("should replace variables in a template", async () => {
      const template = "# [projectName]\n\n[description]";
      const variables: TemplateVariables = {
        projectName: "Test Project",
        description: "Test Description",
        date: "2024-03-20",
      };

      const result = await templateManager.processTemplate(template, variables);
      expect(result).toBe("# Test Project\n\nTest Description");
    });

    it("should handle object variables", async () => {
      const template = "# [projectName]\n\n[config]";
      const variables: TemplateVariables = {
        projectName: "Test Project",
        description: "Test Description",
        date: "2024-03-20",
        config: {
          name: "Test Config",
          value: "Test Value",
        },
      };

      const result = await templateManager.processTemplate(template, variables);
      expect(result).toBe(
        '# Test Project\n\n{\n  "name": "Test Config",\n  "value": "Test Value"\n}'
      );
    });

    it("should handle missing variables", async () => {
      const template = "# [projectName]\n\n[description]\n\n[missing]";
      const variables: TemplateVariables = {
        projectName: "Test Project",
        description: "Test Description",
        date: "2024-03-20",
      };

      const result = await templateManager.processTemplate(template, variables);
      expect(result).toBe("# Test Project\n\nTest Description\n\n");
    });

    it("should handle Handlebars-style variables", async () => {
      const template = "# {{projectName}}\n\n{{description}}";
      const variables: TemplateVariables = {
        projectName: "Test Project",
        description: "Test Description",
        date: "2024-03-20",
      };

      const result = await templateManager.processTemplate(template, variables);
      expect(result).toBe("# Test Project\n\nTest Description");
    });
  });

  describe("getDefaultTemplate", () => {
    it("should return a default template for PROJECT_BRIEF", () => {
      const template = (templateManager as any).getDefaultTemplate(
        "PROJECT_BRIEF"
      );
      expect(template).toContain("[description]");
      expect(template).toContain("Project Brief");
    });

    it("should return a default template for TECHNICAL_PLAN", () => {
      const template = (templateManager as any).getDefaultTemplate(
        "TECHNICAL_PLAN"
      );
      expect(template).toContain("Technical Implementation Plan");
      expect(template).toContain("Data Models");
    });

    it("should return a default template for TASK_LIST", () => {
      const template = (templateManager as any).getDefaultTemplate("TASK_LIST");
      expect(template).toContain("Project Todo List");
      expect(template).toContain("Active Tasks");
    });

    it("should return a default template for MEMORY", () => {
      const template = (templateManager as any).getDefaultTemplate("MEMORY");
      expect(template).toContain("Memory File");
      expect(template).toContain("Project State");
    });

    it("should return a generic default template for unknown templates", () => {
      const template = (templateManager as any).getDefaultTemplate("UNKNOWN");
      expect(template).toBe("# [title]\n\n[content]");
    });
  });
});

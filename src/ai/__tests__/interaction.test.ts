import { AIInteractionManager } from "../interaction.js";
import { jest } from "@jest/globals";
// Import global fs mocks - assuming fs interaction might be implicit
import {
  mockReadFile,
  mockWriteFile,
  mockMkdir,
} from "../../__tests__/setup.js";

// --- Use standard jest.mock with .js extensions ---

// ContextManager Mocks
const mockContextLoad = jest.fn<() => Promise<any>>();
const mockContextSave = jest.fn<() => Promise<void>>();
const mockContextUpdate = jest.fn<() => Promise<void>>();
jest.mock("../../context/index", () => ({
  ContextManager: jest.fn().mockImplementation(() => ({
    load: mockContextLoad,
    save: mockContextSave,
    update: mockContextUpdate,
  })),
}));

// ResponseProcessor Mock
const mockProcessorProcess = jest.fn<() => any>();
const mockProcessorApply = jest.fn<() => Promise<any[]>>();
jest.mock("../processor", () => ({
  ResponseProcessor: jest.fn().mockImplementation(() => ({
    processResponse: mockProcessorProcess,
    applyChanges: mockProcessorApply,
  })),
}));

// PromptManager Mock
const mockPromptsBuildPlanning = jest.fn<() => Promise<string>>();
const mockPromptsBuildImplementation = jest.fn<() => Promise<string>>();
const mockPromptsBuildReview = jest.fn<() => Promise<string>>();
jest.mock("../prompts", () => ({
  PromptManager: jest.fn().mockImplementation(() => ({
    buildPlanningPrompt: mockPromptsBuildPlanning,
    buildImplementationPrompt: mockPromptsBuildImplementation,
    buildReviewPrompt: mockPromptsBuildReview,
  })),
}));

// Anthropic Client Mock
const mockAnthropicCreate = jest.fn(); // Type will be inferred or use specific type if available
jest.mock("@anthropic-ai/sdk", () => ({
  Anthropic: jest.fn().mockImplementation(() => ({
    messages: {
      create: mockAnthropicCreate,
    },
  })),
}));

describe("AIInteractionManager", () => {
  let aiManager: AIInteractionManager;
  const mockProjectRoot = "/test/project";

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Reset specific mock implementations
    mockContextLoad.mockResolvedValue({
      currentTask: "",
      projectState: { phase: "planning", features: [], progress: 0 },
      recentChanges: [],
    });
    mockContextSave.mockResolvedValue(undefined);
    mockContextUpdate.mockResolvedValue(undefined);
    mockProcessorProcess.mockReturnValue({
      content: "",
      suggestions: [],
      files: [],
    });
    mockProcessorApply.mockResolvedValue([]);
    mockPromptsBuildPlanning.mockResolvedValue("Planning prompt");
    mockPromptsBuildImplementation.mockResolvedValue("Implementation prompt");
    mockPromptsBuildReview.mockResolvedValue("Review prompt");
    mockAnthropicCreate.mockResolvedValue({
      id: "msg_123",
      type: "message",
      role: "assistant",
      content: [{ type: "text", text: "AI response" }],
      model: "claude-3-opus-20240229",
      stop_reason: null,
      usage: { input_tokens: 10, output_tokens: 20 },
    } as never);

    // Reset global FS mocks (already imported)
    mockMkdir.mockClear().mockResolvedValue(undefined);
    mockWriteFile.mockClear().mockResolvedValue(undefined);
    mockReadFile.mockClear().mockResolvedValue("");

    // Create AIInteractionManager instance
    aiManager = new AIInteractionManager({
      projectRoot: mockProjectRoot,
    });

    // Removed mock of private method sendToAI
  });

  describe("planProject", () => {
    it("should plan a project based on description", async () => {
      const description = "Test project";
      await aiManager.planProject(description);

      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockPromptsBuildPlanning).toHaveBeenCalledWith(
        description,
        expect.any(Object) // Context is passed here
      );
      // Check if sendToAI (which uses Anthropic client) was called indirectly
      // We might need to adjust the mock of sendToAI or check mockAnthropicCreate directly
      expect(mockAnthropicCreate).toHaveBeenCalled();
      expect(mockProcessorProcess).toHaveBeenCalled(); // Argument might vary
      expect(mockContextSave).toHaveBeenCalled();
    });
  });

  describe("implementTask", () => {
    it("should implement a task based on task object", async () => {
      const task = {
        id: "task-1",
        title: "Test Task",
        description: "Implement ...",
        priority: "high" as const,
        status: "todo" as const,
      };
      await aiManager.implementTask(task.id);

      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockPromptsBuildImplementation).toHaveBeenCalledWith(
        task.id,
        expect.any(Object) // Context is passed here
      );
      expect(mockAnthropicCreate).toHaveBeenCalled();
      expect(mockProcessorProcess).toHaveBeenCalled();
      expect(mockProcessorApply).toHaveBeenCalled();
      expect(mockContextSave).toHaveBeenCalled();
    });
  });

  describe("reviewCode", () => {
    it("should review code based on changes", async () => {
      const changes = [
        {
          type: "file" as const,
          path: "src/test.ts",
          description: "...",
          timestamp: 0,
        },
      ];
      const filePaths = changes.map((c) => c.path);
      await aiManager.reviewCode(filePaths);

      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockPromptsBuildReview).toHaveBeenCalledWith(
        filePaths,
        expect.any(Object) // Context is passed here
      );
      expect(mockAnthropicCreate).toHaveBeenCalled();
      expect(mockProcessorProcess).toHaveBeenCalled();
      expect(mockContextSave).toHaveBeenCalled();
    });
  });
});

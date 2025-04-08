import { WorkflowManager } from "../index.js";
// Import the *actual* classes for type checking if needed, but rely on mocks at runtime
// import { ContextManager } from '../../context/index.js';
// import { AIInteractionManager } from '../../ai/interaction.js';
// import { DocumentationGenerator } from '../../docs/generator.js';
// import { TaskManager } from '../tasks.js';
import fs from "fs/promises";
import { jest } from "@jest/globals";

// --- Mock Setup ---

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

// AIInteractionManager Mocks
const mockAiPlanProject = jest.fn<() => Promise<any>>();
const mockAiImplementTask = jest.fn<() => Promise<any>>();
const mockAiReviewCode = jest.fn<() => Promise<any>>();
jest.mock("../../ai/interaction", () => ({
  AIInteractionManager: jest.fn().mockImplementation(() => ({
    planProject: mockAiPlanProject,
    implementTask: mockAiImplementTask,
    reviewCode: mockAiReviewCode,
  })),
}));

// DocumentationGenerator Mocks
const mockDocsGenerateBrief = jest.fn<() => Promise<void>>();
const mockDocsGeneratePlan = jest.fn<() => Promise<void>>();
const mockDocsUpdateTaskList = jest.fn<() => Promise<void>>();
const mockDocsUpdateMemory = jest.fn<() => Promise<void>>();
jest.mock("../../docs/generator", () => ({
  DocumentationGenerator: jest.fn().mockImplementation(() => ({
    generateProjectBrief: mockDocsGenerateBrief,
    generateTechnicalPlan: mockDocsGeneratePlan,
    updateTaskList: mockDocsUpdateTaskList,
    updateMemory: mockDocsUpdateMemory,
  })),
}));

// TaskManager Mocks
const mockTaskGetAll = jest.fn<() => Promise<any[]>>();
const mockTaskGet = jest.fn<() => Promise<any | undefined>>();
const mockTaskUpdateStatus = jest.fn<() => Promise<any | undefined>>();
const mockTaskAdd = jest.fn<() => Promise<any>>();
jest.mock("../tasks", () => ({
  TaskManager: jest.fn().mockImplementation(() => ({
    getAllTasks: mockTaskGetAll,
    getTask: mockTaskGet,
    updateTaskStatus: mockTaskUpdateStatus,
    addTask: mockTaskAdd,
  })),
}));

describe("WorkflowManager", () => {
  let workflowManager: WorkflowManager;
  const mockProjectRoot = "/test/project";

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Set default resolved values for mocks used in tests
    mockContextLoad.mockResolvedValue({
      currentTask: "",
      projectState: { phase: "planning", features: [], progress: 0 },
      recentChanges: [],
    });
    mockContextSave.mockResolvedValue(undefined);
    mockAiPlanProject.mockResolvedValue({ content: "Planning response" });
    mockAiImplementTask.mockResolvedValue({
      content: "Implementation response",
    });
    mockAiReviewCode.mockResolvedValue({ content: "Review response" });
    mockDocsGenerateBrief.mockResolvedValue(undefined);
    mockDocsGeneratePlan.mockResolvedValue(undefined);
    mockDocsUpdateTaskList.mockResolvedValue(undefined);
    mockDocsUpdateMemory.mockResolvedValue(undefined);
    mockTaskGetAll.mockResolvedValue([]);
    mockTaskGet.mockResolvedValue(undefined);
    mockTaskUpdateStatus.mockResolvedValue(undefined);
    mockTaskAdd.mockResolvedValue({ id: "new-task" });
  });

  describe("planning mode", () => {
    beforeEach(() => {
      workflowManager = new WorkflowManager({
        projectRoot: mockProjectRoot,
        mode: "plan",
      });
    });

    it("should start a planning session", async () => {
      await workflowManager.startSession();
      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockContextSave).toHaveBeenCalled();
      expect(mockDocsGenerateBrief).toHaveBeenCalled();
      expect(mockDocsGeneratePlan).toHaveBeenCalled();
    });
  });

  describe("development mode", () => {
    beforeEach(() => {
      workflowManager = new WorkflowManager({
        projectRoot: mockProjectRoot,
        mode: "dev",
      });
    });

    it("should start a development session", async () => {
      await workflowManager.startSession();
      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockContextSave).toHaveBeenCalled();
    });

    it("should execute a task", async () => {
      const taskId = "task-1";
      const taskData = {
        id: taskId,
        title: "Test Task",
        description: "Desc",
        priority: "high" as const,
        status: "todo" as const,
      };
      // Ensure getTask resolves correctly for the implementation
      mockTaskGet.mockImplementationOnce(() => Promise.resolve(taskData));
      await workflowManager.executeTask(taskId);

      expect(mockTaskGet).toHaveBeenCalledWith(taskId);
      expect(mockTaskUpdateStatus).toHaveBeenCalledWith(taskId, "in-progress");
      // WorkflowManager.executeTask calls implementTask with the task ID
      expect(mockAiImplementTask).toHaveBeenCalledWith(taskId);
    });

    it("should complete a task", async () => {
      const taskId = "task-1";
      const taskInProgress = {
        id: taskId,
        title: "Test Task",
        description: "Desc",
        priority: "high" as const,
        status: "in-progress" as const,
      };
      const taskCompleted = { ...taskInProgress, status: "completed" as const };
      const contextData = {
        currentTask: taskId,
        projectState: { phase: "dev" as const, features: [], progress: 50 },
        recentChanges: [
          {
            type: "code" as const,
            path: "file.ts",
            description: "change",
            timestamp: 123,
          },
        ],
      };

      // Mock load to provide context for updateMemory
      mockContextLoad.mockImplementationOnce(() =>
        Promise.resolve(contextData)
      );
      // Ensure getTask resolves correctly for the implementation
      mockTaskGet.mockImplementationOnce(() => Promise.resolve(taskInProgress));
      // Ensure updateTaskStatus resolves correctly
      mockTaskUpdateStatus.mockImplementationOnce(() =>
        Promise.resolve(taskCompleted)
      );

      await workflowManager.completeTask(taskId);

      expect(mockTaskGet).toHaveBeenCalledWith(taskId);
      expect(mockTaskUpdateStatus).toHaveBeenCalledWith(taskId, "completed");
      // Load is called to get context for updateMemory
      expect(mockContextLoad).toHaveBeenCalled();
      // Ensure updateMemory is called with the recent changes array
      expect(mockDocsUpdateMemory).toHaveBeenCalledWith(
        contextData.recentChanges
      );
      // Save is called after updating memory
      expect(mockContextSave).toHaveBeenCalled();
    });
  });

  describe("review mode", () => {
    beforeEach(() => {
      workflowManager = new WorkflowManager({
        projectRoot: mockProjectRoot,
        mode: "review",
      });
    });

    it("should start a review session", async () => {
      await workflowManager.startSession();
      expect(mockContextLoad).toHaveBeenCalled();
      expect(mockContextSave).toHaveBeenCalled();
    });

    it("should review changes", async () => {
      const changes = [
        {
          type: "file" as const,
          path: "src/index.ts",
          description: "Updated file",
          timestamp: Date.now(),
        },
      ];
      // Mock context load to return some changes for review
      mockContextLoad.mockImplementationOnce(() =>
        Promise.resolve({
          currentTask: "",
          projectState: { phase: "review" as const, features: [], progress: 0 },
          recentChanges: changes,
        })
      );

      // Add a session change to trigger the review
      // This is needed because our implementation uses sessionState.changes
      const workflowManagerAny = workflowManager as any;
      workflowManagerAny.sessionState.changes = [
        {
          type: "file",
          path: "src/index.ts",
          description: "Updated file",
          timestamp: Date.now(),
        },
      ];

      await workflowManager.reviewChanges();

      // Load is called at the start of reviewChanges
      expect(mockContextLoad).toHaveBeenCalled();
      // AI review should be called with the file paths array
      expect(mockAiReviewCode).toHaveBeenCalled();
      // Save is called after review (potentially updating context)
      expect(mockContextSave).toHaveBeenCalled();
    });

    it("should not review if no changes", async () => {
      // Mock context load to return no changes
      mockContextLoad.mockImplementationOnce(() =>
        Promise.resolve({
          currentTask: "",
          projectState: { phase: "review" as const, features: [], progress: 0 },
          recentChanges: [], // No changes
        })
      );

      await workflowManager.reviewChanges();

      // Load is called at the start
      expect(mockContextLoad).toHaveBeenCalled();
      // AI review should NOT be called
      expect(mockAiReviewCode).not.toHaveBeenCalled();
      // Save might still be called depending on logic (e.g., saving state even if no review), adjust if needed based on WorkflowManager implementation
      expect(mockContextSave).toHaveBeenCalled();
    });
  });
});

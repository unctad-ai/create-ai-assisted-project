import { TaskManager } from "../tasks.js";
import path from "path";
import { jest } from "@jest/globals";
import { mockReadFile, mockWriteFile } from "../../__tests__/setup.js";

describe("TaskManager", () => {
  let taskManager: TaskManager;
  const mockProjectRoot = "/test/project";
  const mockTodoPath = path.join(mockProjectRoot, "todo.md");

  beforeEach(() => {
    jest.clearAllMocks();
    taskManager = new TaskManager(mockProjectRoot);

    // Mock readFile for todo.md using imported mock
    mockReadFile.mockImplementation((...args: unknown[]) => {
      const filePath = args[0] as string;
      if (String(filePath) === mockTodoPath) {
        return Promise.resolve(`# Project Todo List

## Active Tasks

### High Priority
- [ ] task-1: Test Task - Test Description

### Medium Priority
- [ ] task-2: Medium Task - Medium Description

### Low Priority
- [ ] task-3: Low Task - Low Description

## In Progress
- [ ] task-4: In Progress Task - In Progress Description

## Completed
- [X] task-5: Completed Task - Completed Description

## Notes for AI
- Update this file by marking tasks as completed [X] when done
`);
      }
      // Default behavior for readFile if not the todo path
      // Resetting to default might be handled in global setup's beforeEach,
      // but specific rejection for missing file is needed here.
      return Promise.reject(new Error("File not found"));
    });

    // Mock writeFile using imported mock
    mockWriteFile.mockImplementation(() => Promise.resolve(undefined));
  });

  describe("getAllTasks", () => {
    it("should get all tasks from todo.md", async () => {
      const tasks = await taskManager.getAllTasks();

      expect(tasks).toHaveLength(5);
      expect(tasks[0].id).toBe("task-1");
      expect(tasks[0].title).toBe("Test Task");
      expect(tasks[0].description).toBe("Test Description");
      expect(tasks[0].priority).toBe("high");
      expect(tasks[0].status).toBe("todo");

      expect(tasks[3].id).toBe("task-4");
      expect(tasks[3].status).toBe("in-progress");

      expect(tasks[4].id).toBe("task-5");
      expect(tasks[4].status).toBe("completed");
    });

    it("should handle missing todo.md", async () => {
      mockReadFile.mockImplementation(() =>
        Promise.reject(new Error("File not found"))
      );

      const tasks = await taskManager.getAllTasks();

      expect(tasks).toHaveLength(0);
    });
  });

  describe("getTask", () => {
    it("should get a specific task by ID", async () => {
      const task = await taskManager.getTask("task-1");

      expect(task).toBeDefined();
      expect(task?.id).toBe("task-1");
      expect(task?.title).toBe("Test Task");
    });

    it("should return undefined for non-existent task", async () => {
      const task = await taskManager.getTask("non-existent");

      expect(task).toBeUndefined();
    });
  });

  describe("updateTaskStatus", () => {
    it("should update a task status", async () => {
      const updatedTask = await taskManager.updateTaskStatus(
        "task-1",
        "completed"
      );

      expect(updatedTask).toBeDefined();
      expect(updatedTask?.id).toBe("task-1");
      expect(updatedTask?.status).toBe("completed");

      expect(mockWriteFile).toHaveBeenCalledWith(
        mockTodoPath,
        expect.any(String)
      );
    });

    it("should return undefined for non-existent task", async () => {
      const updatedTask = await taskManager.updateTaskStatus(
        "non-existent",
        "completed"
      );

      expect(updatedTask).toBeUndefined();
      expect(mockWriteFile).not.toHaveBeenCalled();
    });

    it("should handle file write errors", async () => {
      mockWriteFile.mockImplementation(() =>
        Promise.reject(new Error("Write error"))
      );

      // Expecting updateTaskStatus to resolve to undefined on write error
      await expect(
        taskManager.updateTaskStatus("task-1", "completed")
      ).resolves.toBeUndefined();
      // Optionally check console.error was called if implemented
      // expect(console.error).toHaveBeenCalled();
    });
  });

  describe("addTask", () => {
    it("should add a new task", async () => {
      const newTask = {
        title: "New Task",
        description: "New Description",
        priority: "medium" as const,
        status: "todo" as const,
      };

      const addedTask = await taskManager.addTask(newTask);

      expect(addedTask).toBeDefined();
      expect(addedTask.id).toBe("task-6");
      expect(addedTask.title).toBe("New Task");
      expect(addedTask.description).toBe("New Description");

      expect(mockWriteFile).toHaveBeenCalledWith(
        mockTodoPath,
        expect.any(String)
      );
    });

    it("should create todo.md if it does not exist", async () => {
      mockReadFile.mockImplementation(() =>
        Promise.reject(new Error("File not found"))
      );

      const newTask = {
        title: "New Task",
        description: "New Description",
        priority: "medium" as const,
        status: "todo" as const,
      };

      const addedTask = await taskManager.addTask(newTask);

      expect(addedTask).toBeDefined();
      // ID generation starts from 1 if file doesn't exist
      expect(addedTask.id).toBe("task-1");

      expect(mockWriteFile).toHaveBeenCalledWith(
        mockTodoPath,
        expect.stringContaining("# Project Todo List") // Check default content
      );
    });
  });

  describe("parseTasks", () => {
    it("should parse tasks from todo.md content", () => {
      const content = `# Project Todo List

## Active Tasks

### High Priority
- [ ] task-1: Test Task - Test Description

### Medium Priority
- [ ] task-2: Medium Task - Medium Description

## Completed
- [X] task-3: Completed Task - Completed Description
`;

      const tasks = (taskManager as any).parseTasks(content);

      expect(tasks).toHaveLength(3);
      expect(tasks[0].id).toBe("task-1");
      expect(tasks[0].status).toBe("todo");
      expect(tasks[2].id).toBe("task-3");
      expect(tasks[2].status).toBe("completed");
    });

    it("should handle tasks without IDs", () => {
      const content = `# Project Todo List

## Active Tasks

### High Priority
- [ ] Test Task - Test Description
`;

      const tasks = (taskManager as any).parseTasks(content);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe("task-1");
      expect(tasks[0].title).toBe("Test Task");
    });

    it("should handle tasks without descriptions", () => {
      const content = `# Project Todo List

## Active Tasks

### High Priority
- [ ] task-1: Test Task
`;

      const tasks = (taskManager as any).parseTasks(content);

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe("task-1");
      expect(tasks[0].title).toBe("Test Task");
      expect(tasks[0].description).toBe("");
    });
  });

  describe("generateTaskId", () => {
    it("should generate a new task ID", () => {
      const existingTasks = [
        {
          id: "task-1",
          title: "",
          description: "",
          priority: "high" as const,
          status: "todo" as const,
        },
        {
          id: "task-3",
          title: "",
          description: "",
          priority: "high" as const,
          status: "todo" as const,
        },
      ];

      const newId = (taskManager as any).generateTaskId(existingTasks);

      expect(newId).toBe("task-4");
    });

    it("should handle empty task list", () => {
      const newId = (taskManager as any).generateTaskId([]);

      expect(newId).toBe("task-1");
    });

    it("should handle non-numeric task IDs", () => {
      const existingTasks = [
        {
          id: "task-abc",
          title: "",
          description: "",
          priority: "high" as const,
          status: "todo" as const,
        },
      ];

      const newId = (taskManager as any).generateTaskId(existingTasks);

      expect(newId).toBe("task-1");
    });
  });
});

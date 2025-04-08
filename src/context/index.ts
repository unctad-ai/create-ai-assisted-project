import * as fs from "fs/promises";
import path from "path";

export interface ProjectContext {
  currentTask: string;
  projectState: {
    phase: "planning" | "development" | "review";
    features: Feature[];
    progress: number;
  };
  recentChanges: Change[];
}

export interface Feature {
  id: string;
  name: string;
  status: "planned" | "in-progress" | "completed";
  description: string;
}

export interface Change {
  timestamp: number;
  type: "feature" | "doc" | "test";
  description: string;
}

export class ContextManager {
  private contextPath: string;
  private memoryPath: string;

  constructor(projectRoot: string) {
    this.contextPath = path.join(projectRoot, ".ai-context.json");
    this.memoryPath = path.join(projectRoot, "memory.md");
  }

  async load(): Promise<ProjectContext> {
    try {
      const data = await fs.readFile(this.contextPath, "utf-8");
      return JSON.parse(data);
    } catch {
      return this.createInitialContext();
    }
  }

  async save(context: ProjectContext): Promise<void> {
    await fs.writeFile(this.contextPath, JSON.stringify(context, null, 2));
    await this.updateMemoryFile(context);
  }

  async update(changes: Partial<ProjectContext>): Promise<void> {
    const current = await this.load();
    const updated = { ...current, ...changes };
    await this.save(updated);
  }

  private async updateMemoryFile(context: ProjectContext): Promise<void> {
    const memoryContent = `# Memory File\n\n## Project State\n${JSON.stringify(context.projectState, null, 2)}\n\n## Recent Changes\n${context.recentChanges.map((c) => `- ${c.description}`).join("\n")}`;
    await fs.writeFile(this.memoryPath, memoryContent);
  }

  private createInitialContext(): ProjectContext {
    return {
      currentTask: "",
      projectState: {
        phase: "planning",
        features: [],
        progress: 0,
      },
      recentChanges: [],
    };
  }
}

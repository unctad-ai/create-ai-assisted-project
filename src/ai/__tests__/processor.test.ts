import { ResponseProcessor } from "../processor.js";
import {
  mockReadFile,
  mockMkdir,
  mockWriteFile,
} from "../../__tests__/setup.js";
import type { AIResponse } from "../types.js";

describe("ResponseProcessor", () => {
  let processor: ResponseProcessor;

  beforeEach(() => {
    processor = new ResponseProcessor("/test/project");
    mockReadFile.mockClear();
    mockMkdir.mockClear();
    mockWriteFile.mockClear();
  });

  describe("processResponse", () => {
    it("should process a raw response with file blocks", () => {
      const rawResponse = `Here's what I've done:

\`\`\`file:test.txt
Hello World
\`\`\`

I created a test file.`;

      const result = processor.processResponse(rawResponse);

      expect(result.files).toBeDefined();
      expect(result.files!).toHaveLength(1);
      expect(result.files![0].path).toBe("test.txt");
      expect(result.files![0].content).toBe("Hello World");
    });

    it("should process a raw response with multiple file blocks", () => {
      const rawResponse = `Here's what I've done:

\`\`\`file:test1.txt
Hello
\`\`\`

\`\`\`file:test2.txt
World
\`\`\``;

      const result = processor.processResponse(rawResponse);

      expect(result.files).toBeDefined();
      expect(result.files!).toHaveLength(2);
      expect(result.files![0].path).toBe("test1.txt");
      expect(result.files![0].content).toBe("Hello");
      expect(result.files![1].path).toBe("test2.txt");
      expect(result.files![1].content).toBe("World");
    });

    it("should process a raw response without file blocks", () => {
      const rawResponse = "Just a regular message";

      const result = processor.processResponse(rawResponse);

      expect(result.files).toBeDefined();
      expect(result.files!).toHaveLength(0);
      expect(result.suggestions).toHaveLength(0);
    });

    it("should process a raw response without suggestions", () => {
      const rawResponse = `No suggestions here

\`\`\`file:test.txt
Hello World
\`\`\`
`;

      const result = processor.processResponse(rawResponse);

      expect(result.files).toBeDefined();
      expect(result.files!).toHaveLength(1);
      expect(result.suggestions).toHaveLength(0);
    });
  });

  describe("applyChanges", () => {
    it("should apply changes from an AI response", async () => {
      const response: AIResponse = {
        content: "Test content",
        files: [
          {
            path: "test.txt",
            content: "Hello World",
          },
        ],
      };

      await processor.applyChanges(response);

      expect(mockMkdir).toHaveBeenCalledWith("/test/project", {
        recursive: true,
      });
      expect(mockWriteFile).toHaveBeenCalledWith(
        "/test/project/test.txt",
        "Hello World"
      );
    });

    it("should handle an AI response without files", async () => {
      const response: AIResponse = {
        content: "Test content",
        files: [],
      };

      const result = await processor.applyChanges(response);

      expect(result).toHaveLength(0);
      expect(mockMkdir).not.toHaveBeenCalled();
      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });
});

import { ResponseProcessor } from "../processor.js";
import { jest } from "@jest/globals";
// import fs from "fs/promises"; // REMOVED - Use global mock
import path from "path";
import {
  mockReadFile,
  mockMkdir,
  mockWriteFile,
} from "../../__tests__/setup.js"; // Import global mocks

// REMOVED Local fs mock
// // Mock fs/promises
// jest.mock("fs/promises", () => ({
//   readFile: jest.fn().mockImplementation(() => Promise.resolve("")),
//   mkdir: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
//   writeFile: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
// }));

describe("ResponseProcessor", () => {
  let processor: ResponseProcessor;
  const mockProjectRoot = "/test/project";

  beforeEach(() => {
    jest.clearAllMocks();
    processor = new ResponseProcessor(mockProjectRoot);
  });

  describe("processResponse", () => {
    it("should process a raw response with file blocks", () => {
      const rawResponse = `
# AI Response

Here's my implementation.

\`\`\`file:src/example.ts
console.log('Hello, world!');
\`\`\`

## Suggestions

- Add error handling
- Write tests
`;

      const result = processor.processResponse(rawResponse);

      expect(result.content).toBeDefined();
      expect(result.files).toHaveLength(1);
      expect(result.files?.[0].path).toBe("src/example.ts");
      expect(result.files?.[0].content).toBe("console.log('Hello, world!');");
      expect(result.suggestions).toHaveLength(2);
      expect(result.suggestions?.[0]).toBe("Add error handling");
    });

    it("should process a raw response with multiple file blocks", () => {
      const rawResponse = `
# AI Response

Here's my implementation.

\`\`\`file:src/example1.ts
console.log('Hello, world 1!');
\`\`\`

\`\`\`file:src/example2.ts
console.log('Hello, world 2!');
\`\`\`

## Suggestions

- Add error handling
`;

      const result = processor.processResponse(rawResponse);

      expect(result.files).toHaveLength(2);
      expect(result.files?.[0].path).toBe("src/example1.ts");
      expect(result.files?.[1].path).toBe("src/example2.ts");
    });

    it("should process a raw response without file blocks", () => {
      const rawResponse = `
# AI Response

Here's my analysis.

## Suggestions

- Add error handling
- Write tests
`;

      const result = processor.processResponse(rawResponse);

      expect(result.content).toBeDefined();
      expect(result.files).toHaveLength(0);
      expect(result.suggestions).toHaveLength(2);
    });

    it("should process a raw response without suggestions", () => {
      const rawResponse = `
# AI Response

Here's my implementation.

\`\`\`file:src/example.ts
console.log('Hello, world!');
\`\`\`
`;

      const result = processor.processResponse(rawResponse);

      expect(result.content).toBeDefined();
      expect(result.files).toHaveLength(1);
      expect(result.suggestions).toHaveLength(0);
    });
  });

  describe("applyChanges", () => {
    it("should apply changes from an AI response", async () => {
      const response = {
        content: "Test content",
        files: [
          {
            path: "src/example.ts",
            content: "console.log('Hello, world!');",
          },
        ],
      };

      const result = await processor.applyChanges(response);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Updated file: src/example.ts");
      expect(mockMkdir).toHaveBeenCalledWith(
        // Use imported mock
        path.join(mockProjectRoot, "src"),
        { recursive: true }
      );
      expect(mockWriteFile).toHaveBeenCalledWith(
        // Use imported mock
        path.join(mockProjectRoot, "src/example.ts"),
        "console.log('Hello, world!');"
      );
    });

    it("should handle an AI response without files", async () => {
      const response = {
        content: "Test content",
      };

      const result = await processor.applyChanges(response);

      expect(result).toHaveLength(0);
      expect(mockMkdir).not.toHaveBeenCalled(); // Use imported mock
      expect(mockWriteFile).not.toHaveBeenCalled(); // Use imported mock
    });
  });
});

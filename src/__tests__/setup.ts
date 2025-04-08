import { jest } from "@jest/globals";
// Import types from 'fs' for broader type definitions
import type { PathLike, ObjectEncodingOptions, OpenMode } from "fs";
// Keep fs/promises import for type checking the *functions* being mocked
import type * as FsType from "fs/promises";
import { Anthropic } from "@anthropic-ai/sdk";

// --- Mock fs/promises using unstable_mockModule ---

// Create mock functions *before* mocking the module
// Modify readFile mock signature to align with string usage in tests
export const mockReadFile =
  jest.fn<
    (
      path: PathLike | FsType.FileHandle,
      options?:
        | (ObjectEncodingOptions & { flag?: OpenMode | undefined })
        | BufferEncoding
        | null
    ) => Promise<string>
  >();
export const mockMkdir = jest.fn<typeof FsType.mkdir>();
export const mockWriteFile = jest.fn<typeof FsType.writeFile>();
export const mockStat = jest.fn<typeof FsType.stat>();
export const mockAccess = jest.fn<typeof FsType.access>();
export const mockReaddir = jest.fn<typeof FsType.readdir>();

// Set default implementations
mockReadFile.mockResolvedValue("");
mockMkdir.mockImplementation(() => Promise.resolve(undefined));
mockWriteFile.mockImplementation(() => Promise.resolve(undefined));
mockStat.mockImplementation(() => Promise.resolve({ isDirectory: () => true } as any));
mockAccess.mockImplementation(() => Promise.resolve(undefined));
mockReaddir.mockImplementation(() => Promise.resolve([]));

jest.unstable_mockModule("fs/promises", () => ({
  __esModule: true,
  readFile: mockReadFile,
  mkdir: mockMkdir,
  writeFile: mockWriteFile,
  stat: mockStat,
  access: mockAccess,
  readdir: mockReaddir,
  default: jest.fn(),
}));

// --- Mock Anthropic SDK ---

jest.mock("@anthropic-ai/sdk");

// Mock Anthropic client with proper response shape
export const mockCreate = jest.fn().mockResolvedValue({
  id: "msg_123",
  type: "message",
  role: "assistant",
  content: [{ type: "text", text: "AI response" }],
  model: "claude-3-opus-20240229",
  stop_reason: null,
  usage: { input_tokens: 10, output_tokens: 20 },
} as never);

// --- Mock Context Manager ---

// Create mock for ContextManager
export const mockContextLoad = jest.fn<() => Promise<any>>();
export const mockContextSave = jest.fn<(context: any) => Promise<void>>();
export const mockContextUpdate = jest.fn<(changes: any) => Promise<void>>();

// Set default implementations
mockContextLoad.mockResolvedValue({
  currentTask: "",
  projectState: {
    phase: "planning",
    features: [],
    progress: 0,
  },
  recentChanges: [],
});
mockContextSave.mockImplementation(() => Promise.resolve(undefined));
mockContextUpdate.mockImplementation(() => Promise.resolve(undefined));

jest.mock("../context/index.js", () => ({
  __esModule: true,
  ContextManager: jest.fn().mockImplementation(() => ({
    load: mockContextLoad,
    save: mockContextSave,
    update: mockContextUpdate,
  })),
}));

const MockAnthropicClass = jest.fn(() => ({
  messages: {
    create: mockCreate,
  },
}));

// (Anthropic as unknown as jest.Mock) = MockAnthropicClass; // REMOVED - Invalid assignment in ESM

// --- Setup and Teardown ---

// Removed setupFsMocks function as mocks are now defined globally in this file

// Set up mocks before each test (only resets mocks, doesn't re-apply)
beforeEach(() => {
  // Reset mocks to clear state between tests
  mockReadFile.mockClear().mockResolvedValue("");
  mockMkdir.mockClear().mockImplementation(() => Promise.resolve(undefined));
  mockWriteFile
    .mockClear()
    .mockImplementation(() => Promise.resolve(undefined));
  mockStat
    .mockClear()
    .mockImplementation(() => Promise.resolve({ isDirectory: () => true } as any));
  mockAccess
    .mockClear()
    .mockImplementation(() => Promise.resolve(undefined));
  mockReaddir
    .mockClear()
    .mockImplementation(() => Promise.resolve([]));
  mockCreate.mockClear().mockResolvedValue({
    id: "msg_123",
    type: "message",
    role: "assistant",
    content: [{ type: "text", text: "AI response" }],
    model: "claude-3-opus-20240229",
    stop_reason: null,
    usage: { input_tokens: 10, output_tokens: 20 },
  } as never); // Reset default

  // Reset context manager mocks
  mockContextLoad.mockClear();
  mockContextLoad.mockResolvedValue({
    currentTask: "",
    projectState: {
      phase: "planning",
      features: [],
      progress: 0,
    },
    recentChanges: [],
  });
  mockContextSave.mockClear();
  mockContextSave.mockImplementation(() => Promise.resolve(undefined));
  mockContextUpdate.mockClear();
  mockContextUpdate.mockImplementation(() => Promise.resolve(undefined));
});

// Clear all mocks after each test (redundant with beforeEach reset, but good practice)
afterEach(() => {
  jest.clearAllMocks();
});

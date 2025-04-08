# Project Memory & Analysis (as of YYYY-MM-DD HH:MM)

## Project Setup

- TypeScript codebase using ES Modules (`"type": "module"`).
- Compiles to JavaScript in `dist/`.
- Runs on Node.js >= 18.

## Testing Configuration (`jest.config.mjs`)

- Uses Jest with `ts-jest` preset.
- Explicit ESM support enabled (`useESM: true`, tests run with `--experimental-vm-modules`).
- Custom resolver: `jest-ts-webcompat-resolver`.
- `moduleNameMapper` strips `.js` and `.ts` extensions during resolution.
- Global test setup: `src/__tests__/setup.ts`.

## Mocking Strategy

- **Global (`src/__tests__/setup.ts`):**
  - Mocks `fs/promises` using `jest.unstable_mockModule`.
  - Exports mock functions (`mockReadFile`, `mockMkdir`, `mockWriteFile`) for tests to import and use.
  - Mocks `Anthropic` SDK.
- **Local (within test files):**
  - Mocks project-specific modules using `jest.mock("../../path/to/module.js", ...)`. Note the `.js` extension.
  - **Conflict:** Some tests (e.g., `basic-processor.test.ts`) incorrectly re-mock `fs/promises` locally and attempt direct manipulation (`(fs.mkdir as jest.Mock)...`).

## Test Failures Analysis

- **Root Cause Hypothesis:** Complex interaction between Jest's ESM handling, conflicting `fs` mocking (global vs. local), and inconsistent module path resolution (`jest.mock` paths with `.js` vs. `moduleNameMapper` stripping extensions).
- **Key Errors:**
  - `TypeError: Cannot assign to read only property 'readFile'`: Likely due to Jest's internal state becoming corrupted by the conflicting/incorrect `fs` mocks in an ESM context.
  - `Cannot find module`: Caused by the mismatch between `jest.mock` paths (using `.js`) and the resolver/mapper configuration.
  - `TS2345: assignable to type 'never'`: Type errors from incorrect mock return values (especially `Promise<void>`).

## Goal

- Stabilize the unit tests (`npm run test:unit`) by resolving mocking and module resolution conflicts.

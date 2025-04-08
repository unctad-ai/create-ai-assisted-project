# Unit Test Fix Plan

**Goal:** Resolve Jest unit test failures (`npm run test:unit`) caused by ESM module mocking and resolution conflicts.

**Analysis Summary:** See `memory.md` for detailed analysis. The core issues stem from conflicting `fs` mocking strategies (global vs. local) and inconsistent module path handling in `jest.mock` calls versus Jest's configuration (`moduleNameMapper`, resolver) within an ESM environment.

**Plan:**

1.  **Consolidate `fs` Mocking:**

    - **Action:** Remove any `jest.mock("fs/promises")` calls and direct manipulations (e.g., `(fs.mkdir as jest.Mock)...`) found within individual test files (`src/**/*/__tests__/**/*.test.ts`).
    - **Action:** Ensure tests needing `fs` mocks import the exported mock functions (`mockReadFile`, `mockMkdir`, `mockWriteFile`) from `src/__tests__/setup.ts`.
    - **Rationale:** Enforce the single, global `fs/promises` mock defined in `setup.ts` using `jest.unstable_mockModule` to avoid conflicts.

2.  **Standardize Module Mock Paths:**

    - **Action:** In all test files (`src/**/*/__tests__/**/*.test.ts`), remove the `.js` extension from the module paths used in `jest.mock()` calls for project-specific modules (e.g., change `jest.mock("../../context/index.js", ...)` to `jest.mock("../../context/index", ...)`).
    - **Rationale:** Align mock paths with the `moduleNameMapper` configuration in `jest.config.mjs`, which strips extensions, to fix `Cannot find module` errors.

3.  **Fix Type Errors:**

    - **Action:** Review mock implementations in `src/__tests__/setup.ts` and any remaining local mocks. For functions returning `Promise<void>`, use `mockImplementation(() => Promise.resolve(undefined))` instead of `mockResolvedValue(undefined)`.
    - **Action:** Remove unnecessary type assertions (`as jest.Mock`, `as any`, `as never`) where types can be correctly inferred, addressing `TS2345: assignable to type 'never'` errors.
    - **Rationale:** Ensure mock return types match actual function signatures for type safety.

4.  **Verification:**
    - **Action:** Run `npm run test:unit | cat` after completing steps 1, 2, and 3.
    - **Rationale:** Iteratively verify that changes are resolving errors and to isolate any new issues that might arise.

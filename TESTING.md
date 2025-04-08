# Testing Guidelines

This document outlines the testing structure and best practices for this project.

## Test Organization

This project follows a modular test structure where tests are organized in `__tests__` directories within each module:

- `src/__tests__/` - Contains global test setup and shared test utilities
- `src/ai/__tests__/` - Tests for AI-related functionality
- `src/docs/__tests__/` - Tests for documentation-related functionality
- `src/workflow/__tests__/` - Tests for workflow-related functionality

This structure was chosen because:

1. It keeps tests close to the code they test
2. It maintains a clear separation between tests and implementation
3. It follows common patterns in Node.js/TypeScript projects
4. It makes it easy to find tests for a specific module

## Test Naming Conventions

- All test files should follow the `.test.ts` naming convention
- Test files should be named after the module they test (e.g., `processor.test.ts` tests `processor.ts`)
- If a module has multiple test files, use descriptive prefixes (e.g., `basic-processor.test.ts`, `simple-processor.test.ts`)

## Test Setup

The `src/__tests__/setup.ts` file contains global test setup and common mocks. It:

1. Mocks the `fs/promises` module
2. Mocks the Anthropic SDK
3. Sets up beforeEach and afterEach hooks to reset mocks

## Running Tests

```bash
# Run all tests
npm run test:unit

# Run tests with coverage
npm run test:coverage
```

## Coverage Requirements

This project aims for 100% test coverage. The Jest configuration is set up to enforce this requirement.

## Best Practices

1. **Test Location**: All tests should be placed in a `__tests__` directory within the module they test
2. **Naming Convention**: All test files should follow the `.test.ts` naming convention
3. **Imports**: Tests should import the modules they test using relative paths
4. **Mocks**: Common mocks are available in the `src/__tests__/setup.ts` file
5. **Test Structure**: Use Jest's describe/it syntax for organizing tests
6. **Test Isolation**: Each test should be independent and not rely on the state of other tests
7. **Mock Reset**: Reset mocks between tests to ensure test isolation
8. **Coverage**: Aim for 100% test coverage
9. **Assertions**: Use specific assertions (e.g., `toHaveBeenCalledWith` instead of `toHaveBeenCalled`)
10. **Test Description**: Use descriptive test names that explain what the test is checking

## Adding New Tests

When adding new tests:

1. Create a new test file in the appropriate `__tests__` directory
2. Follow the naming convention: `moduleName.test.ts`
3. Import the module being tested using a relative path
4. Import common mocks from `src/__tests__/setup.ts`
5. Use Jest's describe/it syntax for organizing tests
6. Run the tests to ensure they pass

## Troubleshooting

If tests are failing:

1. Check that the implementation matches the test expectations
2. Verify that mocks are properly set up and reset between tests
3. Ensure that the test is properly isolated from other tests
4. Check for any missing dependencies or imports
5. Look for any asynchronous code that might not be properly awaited

#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Build the project
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

// Create a test directory
const testDir = path.join(rootDir, 'test-output');
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}
fs.mkdirSync(testDir);

// Test the CLI
console.log('\nTesting CLI...');
const testProjectName = 'test-project';
const testProjectPath = path.join(testDir, testProjectName);

try {
  // Run the CLI with default options
  execSync(
    `node ${path.join(rootDir, 'dist/index.js')} ${testProjectName} --template next-app --install false --pm npm`,
    {
      stdio: 'inherit',
      cwd: testDir,
    }
  );

  // Verify the project structure
  const expectedFiles = [
    'package.json',
    'tsconfig.json',
    'project-docs/GETTING_STARTED.md',
    'project-docs/guidelines/development.md',
    'project-docs/guidelines/review.md',
    'project-docs/process/WORKFLOW.md',
    'project-docs/process/DEVELOPMENT_PROCESS.md',
    'project-docs/process/PROJECT_BRIEF.md',
    'project-docs/process/AI_PROMPT_TEMPLATE.md',
    'project-docs/process/TASK_GUIDELINES.md',
    'project-docs/technical/ARCHITECTURE.md',
    'project-docs/technical/FOLDER_STRUCTURE.md',
    'project-docs/technical/TECHNICAL_PLAN.md',
    'project-docs/technical/TECHNICAL_PLANNING.md',
    'memory.md',
    'todo.md',
    'AI_ASSISTANT.md',
    '.gitignore'
  ];

  console.log('\nVerifying project structure...');
  for (const file of expectedFiles) {
    const filePath = path.join(testProjectPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing file: ${file}`);
    }
    console.log(`✓ ${file}`);
  }

  console.log('\nTest completed successfully!');
} catch (error) {
  console.error('\nTest failed:', error.message);
  process.exit(1);
}

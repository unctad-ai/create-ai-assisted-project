#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Get command type from arguments
const args = process.argv.slice(2);
const commandType = args[0];
const input = args[1];

if (!commandType || !['plan', 'dev', 'review'].includes(commandType)) {
  console.error('Please provide a valid command type: plan, dev, or review');
  process.exit(1);
}

// Simple command execution
const executeCommand = async (type, input) => {
  console.log(`Executing ${type} command with input: ${input || 'none'}`);

  try {
    // Update memory.md with command execution
    const memoryPath = path.join(projectRoot, 'memory.md');
    let memoryContent = '';

    try {
      memoryContent = await fs.promises.readFile(memoryPath, 'utf-8');
    } catch (error) {
      memoryContent = '# Memory File\n\n## Project State\n{}\n\n## Recent Changes\n';
    }

    // Add new entry
    const newEntry = `- ${new Date().toISOString()}: Executed ${type} command${input ? ` with input: ${input}` : ''}`;
    const updatedContent = memoryContent.replace('## Recent Changes\n', `## Recent Changes\n${newEntry}\n`);

    await fs.promises.writeFile(memoryPath, updatedContent);

    console.log('Command executed successfully');
    console.log('Memory file updated');

    // Open AI assistant in browser
    console.log('\nPlease continue in your AI assistant chat to complete this command.');
  } catch (error) {
    console.error('Error executing command:', error);
    process.exit(1);
  }
};

// Execute the command
executeCommand(commandType, input);

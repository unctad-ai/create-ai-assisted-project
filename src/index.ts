#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createProject } from './create-project.js';
import { validateProjectName } from './utils/validation.js';
import type { ProjectOptions } from './types.js';

const program = new Command();

program
  .name('create-ai-assisted-project')
  .description('Create a new project with AI-assisted development toolkit')
  .version('1.0.0')
  .argument('[project-directory]', 'Project directory name')
  .option('--template <name>', 'Select project template')
  .option('--install', 'Install dependencies', true)
  .option('--pm <package-manager>', 'Choose package manager')
  .action(async (projectDirectory: string | undefined, options: any) => {
    try {
      // If no project directory provided, prompt for one
      if (!projectDirectory) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectDirectory',
            message: 'What is your project named?',
            validate: validateProjectName,
          },
        ]);
        projectDirectory = answer.projectDirectory;
      }

      // Validate project name
      if (typeof projectDirectory !== 'string') {
        throw new Error('Project directory name is required');
      }
      validateProjectName(projectDirectory);

      // Prompt for missing options
      const projectOptions: ProjectOptions = await promptMissingOptions(options);

      // Create the project
      await createProject(projectDirectory, projectOptions);

      console.log(chalk.green('\nSuccess! Created', projectDirectory));
      console.log('\nInside that directory, you can run several commands:');
      console.log(
        chalk.cyan('\n  npm run dev'),
        '\n    Starts the development server.'
      );
      console.log(
        chalk.cyan('\n  npm test'),
        '\n    Starts the test runner.'
      );
      console.log(
        chalk.cyan('\n  npm run build'),
        '\n    Bundles the app for production.'
      );

      console.log('\nWe suggest that you begin by typing:');
      console.log(chalk.cyan('\n  cd'), projectDirectory);
      console.log(chalk.cyan('  npm run dev'), '\n');
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });

async function promptMissingOptions(options: any): Promise<ProjectOptions> {
  const questions = [];

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which project template would you like to use?',
      choices: [
        { name: 'Next.js (App Router) + TypeScript + shadcn/ui', value: 'next-app' },
        { name: 'React with TypeScript + shadcn/ui', value: 'react-ts' },
      ],
      default: 'next-app',
    });
  }

  if (!options.pm) {
    questions.push({
      type: 'list',
      name: 'pm',
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'bun', value: 'bun' },
      ],
      default: 'npm',
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    template: options.template || answers.template,
    install: options.install,
    packageManager: options.pm || answers.pm,
  };
}

program.parse();

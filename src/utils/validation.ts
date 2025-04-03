import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const validationRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/**
 * Validates the project name according to npm package naming rules
 */
export function validateProjectName(projectName: string): boolean | string {
  const trim = projectName.trim();
  
  if (!trim) {
    return 'Project name cannot be empty';
  }

  if (trim.length > 214) {
    return 'Project name is too long (maximum is 214 characters)';
  }

  if (trim.toLowerCase() !== trim) {
    return 'Project name must be lowercase';
  }

  if (trim.startsWith('.') || trim.startsWith('_')) {
    return 'Project name cannot start with . or _';
  }

  if (!validationRegExp.test(trim)) {
    return 'Project name can only contain URL-friendly characters';
  }

  const targetDir = path.resolve(process.cwd(), trim);
  if (fs.existsSync(targetDir)) {
    return `Directory ${trim} already exists`;
  }

  return true;
}

/**
 * Validates if a command exists in the system
 */
export function commandExists(command: string): boolean {
  try {
    execSync(`command -v ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates package manager availability
 */
export function validatePackageManager(pm: string): boolean {
  switch (pm) {
    case 'npm':
      return commandExists('npm');
    case 'yarn':
      return commandExists('yarn');
    case 'pnpm':
      return commandExists('pnpm');
    case 'bun':
      return commandExists('bun');
    default:
      return false;
  }
}

/**
 * Validates template name
 */
export function validateTemplate(template: string): boolean {
  const validTemplates = ['next-app', 'react-ts'];
  return validTemplates.includes(template);
}

export interface ProjectOptions {
  template: 'next-app' | 'react-ts';
  install: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

export interface TemplateConfig {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  files: string[];
}

export interface ArchitectureConfig {
  name: string;
  description: string;
  folders: string[];
  files: string[];
  dependencies?: string[];
  devDependencies?: string[];
}

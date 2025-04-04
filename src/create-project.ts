import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import type { ProjectOptions } from './types.js';
import { copyDir, writeFile, readFile, pathExists } from './utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a new project with the specified options
 */
export async function createProject(
  projectName: string,
  options: ProjectOptions
): Promise<void> {
  const spinner = ora('Creating project...').start();
  const targetDir = path.resolve(process.cwd(), projectName);
  
  try {
    // Copy template files
    const templateDir = path.resolve(__dirname, '../templates', options.template, 'template');
    await copyDir(templateDir, targetDir);

    // Create project structure folder README files
    if (options.template.includes('react') || options.template.includes('next')) {
      // Create standard folders for better organization
      const projectFolders = [
        { path: 'src/components', desc: 'React components used across the application' },
        { path: 'src/lib', desc: 'Utility functions and shared code' },
        { path: 'src/hooks', desc: 'Custom React hooks' },
        { path: 'src/styles', desc: 'Global styles and theme configuration' },
        { path: 'src/types', desc: 'TypeScript type definitions' },
        { path: 'src/api', desc: 'API client and related functionality' },
        { path: 'src/context', desc: 'React context providers' },
        { path: 'src/utils', desc: 'Utility functions' }
      ];
      
      for (const folder of projectFolders) {
        const folderPath = path.join(targetDir, folder.path);
        await fs.promises.mkdir(folderPath, { recursive: true });
        
        // README files are removed as they're unnecessary
      }
      
      // Add shadcn-ui setup later during install process
    }

    // Process package.json
    const pkgPath = path.join(targetDir, 'package.json');
    if (await pathExists(pkgPath)) {
      const pkgContent = await readFile(pkgPath);
      const pkg = JSON.parse(pkgContent);
      pkg.name = projectName;
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
      
      // Update project name in App.tsx files
      if (options.template === 'react-ts') {
        const appFiles = [
          path.join(targetDir, 'src/App.tsx'),
          path.join(targetDir, 'src/presentation/components/App.tsx')
        ];
        
        for (const appFile of appFiles) {
          if (await pathExists(appFile)) {
            const content = await readFile(appFile);
            const updatedContent = content.replace(
              '<h1>React Application</h1>',
              `<h1>${projectName}</h1>`
            );
            await writeFile(appFile, updatedContent);
          }
        }
        
        // Update test files
        const testFiles = [
          path.join(targetDir, 'src/App.test.tsx'),
          path.join(targetDir, 'src/presentation/components/App.test.tsx')
        ];
        
        for (const testFile of testFiles) {
          if (await pathExists(testFile)) {
            const content = await readFile(testFile);
            const updatedContent = content.replace(
              "toHaveTextContent('React Application')",
              `toHaveTextContent('${projectName}')`
            );
            await writeFile(testFile, updatedContent);
          }
        }
      }
    }

    // Copy common AI workflow files and documentation
    const commonDir = path.resolve(__dirname, '../templates/common');
    
    // Copy project-docs directory
    const projectDocsDir = path.join(commonDir, 'project-docs');
    const targetProjectDocsDir = path.join(targetDir, 'project-docs');
    await copyDir(projectDocsDir, targetProjectDocsDir);
    
    // Get current date for templating
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Determine language and framework-specific content
    let technicalStack = "";
    let languageFrameworkGuidance = "";
    
    // Set up language/framework specific content based on template
    if (options.template === 'react-ts') {
      technicalStack = "React, TypeScript, Vite, Tailwind CSS, shadcn/ui";
      languageFrameworkGuidance = `## React & TypeScript Guidelines
- Use functional components with hooks
- Implement proper state management
- Create reusable components
- Optimize rendering with memoization
- TypeScript with strict typing is mandatory
- camelCase for functions/variables, PascalCase for components/interfaces/types
- kebab-case for file names
- Type all props and state

## Build Commands
- Build: \`npm run build\` (React/Vite build)
- Dev: \`npm run dev\` (starts development server)
- Test: \`npm test\` (runs test suite)
- Lint: \`npm run lint\` (runs ESLint)
- Format: \`npm run format\` (runs Prettier)

## Project Structure
- src/components/ - React components 
- src/hooks/ - Custom React hooks
- src/utils/ - Utility functions
- src/types/ - TypeScript type definitions`;
    } 
    else if (options.template === 'next-app') {
      technicalStack = "Next.js, React, TypeScript, Tailwind CSS, shadcn/ui";
      languageFrameworkGuidance = `## Next.js & TypeScript Guidelines
- Use App Router for all Next.js projects
- Server Components by default, Client Components when needed
- Proper use of layout.tsx and page.tsx
- Route handlers in app/api directory
- Data fetching using React Server Components
- TypeScript with strict typing is mandatory
- camelCase for functions/variables, PascalCase for components/interfaces/types
- kebab-case for file names
- Type all props and state

## Build Commands
- Build: \`npm run build\` (Next.js build)
- Dev: \`npm run dev\` (starts development server)
- Test: \`npm test\` (runs test suite)
- Lint: \`npm run lint\` (runs ESLint)
- Format: \`npm run format\` (runs Prettier)

## Project Structure
- src/app/ - Next.js App Router pages 
- src/components/ - React components
- src/lib/ - Utility functions & shared code
- src/types/ - TypeScript type definitions`;
    }
    // More templates can be added here with their specific guidance
    
    // Copy and process AI_ASSISTANT.md with template variables
    const aiAssistantPath = path.join(commonDir, 'AI_ASSISTANT.md');
    let aiAssistantContent = await readFile(aiAssistantPath);
    aiAssistantContent = aiAssistantContent
      .replace(/{{LANGUAGE_FRAMEWORK_GUIDANCE}}/g, languageFrameworkGuidance);
    await writeFile(path.join(targetDir, 'AI_ASSISTANT.md'), aiAssistantContent);
    
    // Create .github/copilot-instructions.md for GitHub Copilot
    const githubDir = path.join(targetDir, '.github');
    await fs.promises.mkdir(githubDir, { recursive: true });
    await writeFile(path.join(githubDir, 'copilot-instructions.md'), aiAssistantContent);
    
    // Copy and process memory.md with template variables
    const memoryMdPath = path.join(commonDir, 'memory.md');
    let memoryMdContent = await readFile(memoryMdPath);
    memoryMdContent = memoryMdContent
      .replace(/{{PROJECT_NAME}}/g, projectName)
      .replace(/{{TECHNICAL_STACK}}/g, technicalStack || "To be determined");
    await writeFile(path.join(targetDir, 'memory.md'), memoryMdContent);
    
    // Copy and process todo.md with template variables
    const todoMdPath = path.join(commonDir, 'todo.md');
    let todoMdContent = await readFile(todoMdPath);
    todoMdContent = todoMdContent
      .replace(/{{CREATION_DATE}}/g, currentDate);
    await writeFile(path.join(targetDir, 'todo.md'), todoMdContent);

    // Initialize git repository (always)
    spinner.text = 'Initializing git repository...';
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });

    // Install dependencies
    if (options.install) {
      spinner.text = 'Installing dependencies...';
      const installCmd = getInstallCommand(options.packageManager);
      execSync(installCmd, { cwd: targetDir, stdio: 'ignore' });
      
      // Install and setup shadcn-ui for React/Next.js projects
      if (options.template === 'react-ts' || options.template === 'next-app') {
        spinner.text = 'Setting up shadcn/ui...';
        const shadcnDeps = [
          'tailwindcss', 
          'postcss', 
          'autoprefixer', 
          '@types/node',
          'tailwindcss-animate',
          'class-variance-authority',
          'clsx',
          'tailwind-merge',
          'lucide-react',
          '@radix-ui/react-dialog',
          '@radix-ui/react-dropdown-menu',
          '@radix-ui/react-slot'
        ];
        
        const shadcnInstallCmd = `${options.packageManager === 'npm' ? 'npm install' : 
          options.packageManager === 'yarn' ? 'yarn add' : 
          options.packageManager === 'pnpm' ? 'pnpm add' : 
          'bun add'} ${shadcnDeps.join(' ')} --save`;
          
        execSync(shadcnInstallCmd, { cwd: targetDir, stdio: 'ignore' });
        
        // Create shadcn-ui configuration files
        await writeFile(
          path.join(targetDir, 'tailwind.config.js'),
          `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`
        );
        
        await writeFile(
          path.join(targetDir, 'postcss.config.js'),
          `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
        );
        
        // Create shadcn/ui component utils
        await fs.promises.mkdir(path.join(targetDir, 'src/lib/utils'), { recursive: true });
        await writeFile(
          path.join(targetDir, 'src/lib/utils.ts'),
          `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`
        );
        
        // Create basic UI components
        await fs.promises.mkdir(path.join(targetDir, 'src/components/ui'), { recursive: true });
        await writeFile(
          path.join(targetDir, 'src/components/ui/button.tsx'),
          `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`
        );
        
        // Create global.css with shadcn-ui variables
        await writeFile(
          path.join(targetDir, 'src/styles/globals.css'),
          `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
        );
        
        // Update main CSS import for the application
        if (options.template === 'react-ts') {
          // Update main.tsx to use the globals.css
          const mainPath = path.join(targetDir, 'src/main.tsx');
          if (await pathExists(mainPath)) {
            const content = await readFile(mainPath);
            const updatedContent = content.replace(
              `import './index.css'`,
              `import './styles/globals.css'`
            );
            await writeFile(mainPath, updatedContent);
          }
        }
      }
    }

    spinner.succeed(chalk.green('Project created successfully!'));
    
    console.log('\nNext steps:');
    console.log(chalk.cyan(`  cd ${projectName}`));
    
    if (!options.install) {
      console.log(chalk.cyan(`  ${options.packageManager} install`));
    }
    
    console.log(chalk.cyan('  npm run dev'));
    
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

/**
 * Get the install command for the selected package manager
 */
function getInstallCommand(packageManager: string): string {
  switch (packageManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
    default:
      return 'npm install';
  }
}

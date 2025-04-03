# CLAUDE.md

This file provides guidance to AI coding agent when working with code in this repository.

## Build Commands
- Build: `npm run build` (Next.js/React build)
- Dev: `npm run dev` (starts development server)
- Test: `npm test` (runs test suite)
- Lint: `npm run lint` (runs ESLint)
- Format: `npm run format` (runs Prettier)

## Code Style
- TypeScript with strict typing is mandatory
- camelCase for functions/variables, PascalCase for components/interfaces/types
- kebab-case for file names
- Proper component exports using named exports
- Type all props and state
- Async/await pattern for asynchronous operations
- Error handling with informative messages and proper try/catch
- Zero tolerance for TS/lint warnings
- Use shadcn/ui components with Tailwind CSS

## Next.js Best Practices
- Use App Router for all Next.js projects
- Server Components by default, Client Components when needed
- Proper use of layout.tsx and page.tsx
- Route handlers in app/api directory
- Data fetching using React Server Components
- React Server Components when possible, Client Components when needed
- Implement proper loading states and error boundaries

## Component Organization
- UI components in src/components/ui
- Feature-specific components in src/components/[feature]
- Page components in src/app/[route]/page.tsx
- Custom hooks in src/hooks folder
- Utilities in src/utils and src/lib folders
- Type definitions in src/types folder

## Development Workflow
- Test-driven development approach
- One task per session
- Documentation updates alongside code changes
- Commit format: "feat: [task] - [description]"
- Update todo.md and memory.md after completing tasks
- Git usage is mandatory

## Project Structure
- src/ - Source code with well-organized folders
- memory.md - Project context and state
- todo.md - Task management
- CLAUDE.md - AI coding agent guidelines
# Memory File

This file is used to track the ongoing state of the project for AI-assisted development.

- **Purpose**: This file helps AI agents maintain context between sessions
- **Updates**: Record significant changes, decisions, and learnings
- **Usage**: Update after completing each task in todo.md

## Project Overview

**Project Description**: @unctad-ai/create-ai-assisted-project - A CLI tool for creating new projects with built-in AI-assisted development workflow support

**Technical Stack**: TypeScript, Node.js, CLI tools (commander, inquirer, ora, chalk)

**Architecture**: CLI tool with templating capabilities and workflow documentation

## Current State

- Comprehensive AI-assisted development workflow implemented
- Core documentation structure established
- Templates for React and Next.js applications with shadcn/ui
- Well-defined memory and task management approach
- Standardized prompt templates for AI interactions
- Clear development guidelines
- Reorganized folder structure documentation

## Implementation Details

- CLI tool (`@unctad-ai/create-ai-assisted-project`) generates projects with all needed files
- Templates include essential AI workflow files (memory.md, todo.md, CLAUDE.md)
- Core workflow process defined in project-docs/guidelines/development.md and review.md
- Documentation organized in project-docs/ with clear purpose for each section
- Planning process implemented with PROJECT_BRIEF.md and TECHNICAL_PLANNING.md templates
- Standard AI prompt format established in AI_PROMPT_TEMPLATE.md
- Package name updated to better reflect project purpose

## Recent Changes

- Reorganized documentation structure into project-docs/ with clearer organization:
  - project-docs/guidelines/ for development and review guidance
  - project-docs/process/ for workflow documents
  - project-docs/technical/ for architectural documents
  - GETTING_STARTED.md at root level for quick onboarding
- Improved review guidelines to better align with AI-assisted development
- Added planning phase documentation and templates
- Streamlined documentation to remove redundancies
- Added troubleshooting guidance for common AI workflow issues
- Updated README with clear "Working with AI" section
- Renamed package to "@unctad-ai/create-ai-assisted-project"
- Added folder structure guidelines
- Created GETTING_STARTED.md with detailed onboarding steps
- Added TASK_GUIDELINES.md with criteria for well-defined tasks
- Enhanced AI_PROMPT_TEMPLATE.md with concrete examples
- Added a troubleshooting prompt template
- Tested workflow with simulated LLM interaction

## Next Steps

- Complete CLI tool implementation
- Add more project templates
- Test with real-world projects
- Enhance examples of AI interactions
- Consider adding more architectural patterns
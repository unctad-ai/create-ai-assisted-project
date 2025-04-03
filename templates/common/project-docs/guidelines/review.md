# Review Guidelines

## Post-Project Review Process

### Code Formatting & Testing
1. Run code formatters:
   - JavaScript/TypeScript: `npm run format` or `prettier --write .`
   - .NET: `dotnet format`
   - Other: Use language-specific formatters

2. Execute test suite:
   - Run all tests: `npm test` or `dotnet test`
   - Fix ALL failing tests (zero-tolerance)
   - Address ALL warnings (no exceptions)

### Code Review
1. Get changed files list:
   ```bash
   git diff --name-only main
   ```
2. Review each modified file:
   - Verify project guidelines compliance
   - Check code quality and readability
   - Ensure proper documentation
   - Look for potential improvements

### Project Documentation Review
1. Todo List Verification:
   - Check all tasks are marked complete [X]
   - Verify implementation matches requirements
   - Document any deferred tasks

2. Memory File Assessment:
   - Review current project state documentation
   - Add significant decisions and their context
   - Document challenges and solutions
   - Evaluate what should be added to application memory

3. Development Guidelines:
   - Review and update based on project learnings
   - Add new best practices discovered
   - Refine workflow processes
   - Document any new tools or techniques

### Version Control
1. Branch Management:
   - Confirm work was done in feature branch
   - Ensure branch is up to date with main
   - Resolve any merge conflicts

2. Pull Request:
   - Create detailed PR description
   - Link related issues/tickets
   - Add relevant reviewers
   - Include test evidence

### Final Validation
- Run final format check
- Execute complete test suite
- Verify all documentation is updated
- Ensure clean git status

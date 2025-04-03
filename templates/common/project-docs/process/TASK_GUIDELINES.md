# Task Guidelines

This document provides guidance on creating effective tasks for AI-assisted development.

## Characteristics of Effective Tasks

A well-defined task for AI-assisted development should:

1. **Be Specific and Actionable**
   - Clear description of what needs to be done
   - Specific files or components to modify
   - Defined acceptance criteria

2. **Have Appropriate Scope**
   - Completable in a single chat session (typically 30-60 minutes)
   - Focused on a single responsibility or feature
   - Not too broad or too narrow

3. **Include Context**
   - References to related components or systems
   - Background information needed for implementation
   - Relationship to other tasks or features

4. **Define Clear Outcomes**
   - Specific acceptance criteria
   - Expected behavior changes
   - Any performance requirements

## Task Structure Template

```
[Task Name]: Brief one-line description

Context:
[Background information about why this task is needed]

Objective:
[What specifically needs to be done]

Acceptance Criteria:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

Related Components:
- [Component 1]
- [Component 2]

Dependencies:
- [Dependency 1]
- [Dependency 2]

Complexity: [Low/Medium/High]
```

## Example Tasks

### Good Task Examples

#### Example 1: Specific Implementation Task

```
Implement User Authentication Form: Create a login form with email and password fields

Context:
Users need to authenticate before accessing the application. We're using Firebase for authentication.

Objective:
Create a React component for user login with email and password fields.

Acceptance Criteria:
- Form has email and password fields with appropriate validation
- Submit button is disabled until form is valid
- Loading state is shown during authentication
- Error messages are displayed when authentication fails
- Successful login redirects to dashboard

Related Components:
- src/components/ui/Button.tsx
- src/components/ui/Input.tsx
- src/hooks/useAuth.ts

Dependencies:
- Firebase authentication must be configured

Complexity: Medium
```

#### Example 2: Testing Task

```
Write Unit Tests for Task Management Service: Create comprehensive tests for the task creation and updating functions

Context:
The task management service handles CRUD operations for tasks and needs test coverage.

Objective:
Write unit tests for createTask and updateTask functions in TaskService.

Acceptance Criteria:
- Tests cover successful creation/update scenarios
- Tests cover error handling cases
- Tests verify correct data transformation
- Test coverage is at least 90%

Related Components:
- src/services/TaskService.ts
- src/models/Task.ts

Dependencies:
- None

Complexity: Low
```

### Poor Task Examples (With Improvements)

#### Poor Example 1: Too Vague

```
Implement authentication
```

Improved:

```
Implement User Authentication: Create Firebase authentication service and login form

Context:
Users need to authenticate before accessing the application.

Objective:
Create an authentication service and login form using Firebase.

Acceptance Criteria:
- Create Firebase authentication service with login/logout methods
- Implement login form with email/password fields
- Add form validation and error handling
- Show loading state during authentication
- Redirect to dashboard after successful login

Related Components:
- New service: src/services/AuthService.ts
- New component: src/components/auth/LoginForm.tsx

Dependencies:
- Firebase must be set up in the project

Complexity: High
```

#### Poor Example 2: Too Broad

```
Build the entire user dashboard
```

Improved:

```
Create Dashboard Layout: Implement the basic structure of the user dashboard

Context:
The dashboard is the main interface after login, displaying user tasks and statistics.

Objective:
Create the dashboard layout with header, sidebar, and main content area.

Acceptance Criteria:
- Create responsive layout following the design mockup
- Implement header with user information and logout button
- Create sidebar with navigation links
- Add main content area for task display
- Ensure layout works on mobile and desktop

Related Components:
- src/components/layout/Header.tsx
- src/components/layout/Sidebar.tsx
- src/pages/Dashboard.tsx

Dependencies:
- Authentication system must be implemented

Complexity: Medium
```

## Task Estimation Guidelines

Use these guidelines to estimate task complexity:

| Complexity | Time Estimate | Characteristics |
|------------|---------------|-----------------|
| Low        | 30-60 min     | Simple changes, clear implementation path, minimal dependencies |
| Medium     | 1-2 hours     | Multiple files, moderate complexity, some dependencies |
| High       | 2-4 hours     | Complex logic, multiple systems interaction, may need to be broken down further |

## Task Prioritization

Consider these factors when prioritizing tasks:

1. **Dependencies**: Tasks that block other work should be higher priority
2. **Business Value**: Features with direct user impact
3. **Technical Debt**: Issues that may cause problems if delayed
4. **Complexity**: Sometimes tackling complex tasks early reduces risk

Remember to update todo.md after completing each task, moving tasks between Active, In Progress, Blocked, and Completed sections as appropriate.
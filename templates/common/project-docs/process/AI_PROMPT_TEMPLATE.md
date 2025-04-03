# AI Prompt Templates

This document provides standardized prompt templates for working with AI assistants on this project.

## Primary Development Prompt

```
Continue working on the project. Follow the development guidelines in project-docs/guidelines/development.md, and remember everything in memory.md.

Our current task from todo.md is:
[Copy specific task here]

Let's proceed with [specific next action].
```

### Example with Real Task

```
Continue working on the project. Follow the development guidelines in project-docs/guidelines/development.md, and remember everything in memory.md.

Our current task from todo.md is:
Implement User Authentication Form: Create a login form with email and password fields that validates input and connects to the authentication service.

Let's proceed with writing tests for the login form component first.
```

## Task Selection Prompt

```
Review the todo.md file and help me select the next task to work on. Consider:
1. Task dependencies
2. Current project state in memory.md
3. Priority of remaining tasks

Suggest 2-3 tasks that would be appropriate to tackle next and explain your reasoning.
```

### Example:

```
Review the todo.md file and help me select the next task to work on. 

We've just completed the user authentication service implementation, and according to memory.md, we now have the core authentication functionality but no UI for users to interact with it.

Suggest 2-3 tasks that would be appropriate to tackle next and explain your reasoning.
```

## Technical Planning Prompt

```
Help me create a technical implementation plan for the following feature:
[Feature description]

Please follow the guidelines in project-docs/technical/TECHNICAL_PLANNING.md, and ensure the plan includes:
- Data models
- API definitions
- Component structure
- Libraries needed
- Implementation sequence

The plan should be detailed enough that we can break it down into specific tasks for todo.md.
```

### Example:

```
Help me create a technical implementation plan for task management functionality.

Users need to be able to create, view, update, and delete tasks. Each task should have a title, description, priority level, and status. Tasks should be categorizable and filterable.

Please follow the guidelines in project-docs/technical/TECHNICAL_PLANNING.md, and ensure the plan is detailed enough that we can break it down into specific tasks for todo.md.
```

## Project Review Prompt

```
Review the current state of the project following the guidelines in project-docs/guidelines/review.md.

Focus on:
1. Code quality and adherence to standards
2. Test coverage and passing tests
3. Documentation completeness
4. Todo list verification

Provide an assessment and recommendations for improvement.
```

### Example:

```
Review the current state of the user authentication feature we've implemented over the past week. Follow the guidelines in project-docs/guidelines/review.md.

We've implemented:
- Authentication service with Firebase
- Login/signup forms
- Protected routes
- User profile management

Please assess code quality, test coverage, documentation, and completeness against our todo.md tasks.
```

## Code Analysis Prompt

```
Analyze the following code from [file path]:
[Code snippet]

Provide insights on:
1. Potential bugs or edge cases
2. Performance considerations
3. Adherence to project coding standards
4. Suggested improvements
```

### Example:

```
Analyze the following code from src/services/TaskService.ts:

```typescript
export const createTask = async (task: TaskInput): Promise<Task> => {
  try {
    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: task.status || 'pending'
    };
    
    await localforage.setItem(`task-${newTask.id}`, newTask);
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};
```

I'm particularly concerned about error handling and data validation.
```

## Task Breakdown Prompt

```
Help me break down the following task into smaller, manageable subtasks:
[Task description]

Each subtask should:
1. Be clearly defined with acceptance criteria
2. Take no more than 1-2 hours to complete
3. Have clear dependencies identified
4. Be suitable for a single AI chat session
```

### Example:

```
Help me break down the following task into smaller, manageable subtasks:

"Implement task filtering and sorting functionality: Allow users to filter tasks by status, priority, and sort them by different criteria."

Each subtask should be suitable for completion in a single chat session and have clear acceptance criteria.
```

## Documentation Creation Prompt

```
Create documentation for [component/feature/API], covering:
1. Purpose and functionality
2. Usage examples
3. Parameters and return values
4. Edge cases and error handling
5. Related components or features

Follow the documentation standards established in our project.
```

### Example:

```
Create documentation for the TaskService API, covering:
1. Purpose and functionality of each method
2. Usage examples for common scenarios
3. Parameters and return values with type information
4. Error handling approach
5. How it integrates with the UI components

This documentation will go in the README.md in the services directory.
```

## Troubleshooting Prompt

```
I'm experiencing an issue with [component/feature]. Here are the details:

- What I'm trying to do: [action]
- Current behavior: [observed results]
- Expected behavior: [desired results]
- Error messages: [errors if any]

Related code:
```
[code snippet]
```

Can you help me diagnose and fix this issue?
```

### Example:

```
I'm experiencing an issue with the task creation form. Here are the details:

- What I'm trying to do: Submit a new task with a due date
- Current behavior: The form submits but the due date is not saved correctly
- Expected behavior: The due date should be stored and displayed properly
- Error messages: No errors in console, but the date appears as "Invalid Date"

Related code:
```jsx
const handleSubmit = (values) => {
  const newTask = {
    ...values,
    dueDate: values.dueDate,  // This might be the issue
    status: 'pending'
  };
  createTask(newTask);
};
```

Can you help me diagnose and fix this issue?
```
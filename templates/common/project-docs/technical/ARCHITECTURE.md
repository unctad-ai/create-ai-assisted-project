# Architecture Guidelines

This document provides guidance on selecting and implementing an appropriate architecture for your project.

## Core Philosophy

Architecture choice is less critical than consistency and understanding.

Select an architecture that:
- Has proven success with human developers
- Is well-documented with many examples
- Can be clearly understood and maintained
- Aligns with your team's expertise

## Recommended Approaches

### 1. Domain-Driven Design (Primary Recommendation)
- Focuses on core business domain
- Clear separation of concerns
- Well-established patterns and practices
- Strong community support
- Extensive documentation and examples

Typical structure:
```
src/
  domain/       # Core business logic and entities
  application/  # Use cases and application services
  infrastructure/ # External concerns (DB, API, etc.)
  presentation/ # UI components and controllers
```

### 2. Alternative Architectures
- **Vertical Slice Architecture**
  - Feature-focused organization
  - Reduced cross-cutting concerns
  - Simplified maintenance
  
- **Event-Driven Architecture**
  - Loose coupling
  - Scalable and flexible
  - Good for distributed systems
  
- **Simple CRUD**
  - Straightforward implementation
  - Quick to build
  - Suitable for basic applications

## Selection Guidelines

### Key Factors
1. **Team Experience**
   - Choose architectures your team understands
   - Leverage existing knowledge
   - Consider learning curve

2. **Project Requirements**
   - Business domain complexity
   - Scalability needs
   - Integration requirements
   - Maintenance expectations

3. **Implementation Clarity**
   - Clear boundaries
   - Well-defined interfaces
   - Documented patterns
   - Easy to explain and understand

## Architecture Documentation Process

1. **Decision Documentation**
   - Document your chosen architecture in your memory.md file
   - Explain the reasoning behind your choice
   - Note any deviations from standard patterns

2. **Technical Implementation**
   - Create a technical plan following project-docs/technical/TECHNICAL_PLANNING.md
   - Define key components and their relationships
   - Establish naming conventions and patterns
   - Document in project-docs/technical/TECHNICAL_PLAN.md

3. **Task Breakdown**
   - Convert architectural implementation to specific tasks
   - Add structural setup tasks to todo.md
   - Prioritize foundation components first

Remember: Architecture should support your development process, not hinder it. The goal is to have a clear, consistent structure that both humans and AI assistants can understand and work with effectively.

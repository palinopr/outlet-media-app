# Development Planning Skill

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding)

**When to use:** When the user explicitly asks to create a dev plan, development plan, or document development requirements.

## Core Principles

- **Planning occurs before code**: Thoroughly understand project context and requirements first
- **Context gathering is critical**: Always start by understanding the existing codebase and documentation
- **Phased approach**: Break work into discrete, manageable phases with human review checkpoints
- **Simplicity over complexity**: Keep solutions free of unnecessary abstractions
- **Actionable output**: The plan must be clear enough for another agent to execute independently

## Planning Process

### Step 1: Context Gathering

If there is existing code in the project:

1. Read all relevant files in the project directory
2. Examine existing documentation (README.md, docs/, CONTRIBUTING.md, etc.)
3. Analyse codebase structure, architecture, and dependencies
4. Identify coding conventions, patterns, and standards used
5. Review existing tests to understand expected behaviour
6. Note package versions and technology stack choices

### Step 2: Requirements Analysis

Based on your conversation with the user:

1. Identify the core goal and objectives
2. List hard requirements explicitly stated
3. Document any unknowns or assumptions
4. Consider edge cases and architectural implications
5. Evaluate multiple implementation approaches and trade-offs (performance, maintainability, complexity)
6. Identify integration points with existing code
7. Clarify any ambiguous requirements with the user before proceeding

### Step 3: Task Breakdown

Organise development into phases:

- Each phase should be independently testable and reviewable
- Break down complex tasks into sub-tasks (use nested checkboxes)
- Identify dependencies between tasks
- Order tasks logically within each phase
- Each phase MUST end with:
  - A self-review checkpoint
  - A "STOP and wait for human review" checkpoint

### Step 4: Quality Assurance Planning

Build a concise QA checklist that includes (if applicable):

- Standard items (listed below)
- Project-specific requirements gathered from conversation
- Technology-specific checks (e.g., "ESLint clean" for JavaScript, "Go vet passes" for Go)
- Security considerations mentioned
- Any other quality gates discussed with the user

### Step 5: Deep Review

Before finalising:

1. Deeply consider:
   - Implementation approach soundness
   - Potential architectural issues
   - Constraint satisfaction
   - Alignment to requirements
   - Missing considerations
2. Make necessary adjustments to the plan

## Development Plan Structure

Create a new file called `DEVELOPMENT_PLAN.md` with this structure:

```markdown
# Development Plan for [PROJECT_NAME]

## Project Purpose and Goals

[Clear statement of what this project aims to achieve and why]

## Context and Background

[Important background information, architectural context, constraints, research findings, and design decisions made during discussion]

## Development Tasks

### Phase 1: [Phase Name]

- [ ] Task 1
  - [ ] Sub-task 1.1 (if needed)
  - [ ] Sub-task 1.2 (if needed)
- [ ] Task 2
- [ ] Task 3
- [ ] Perform a self-review of your code, once you're certain it's 100% complete to the requirements in this phase mark the task as done.
- [ ] STOP and wait for human review

### Phase 2: [Phase Name]

- [ ] Task 1
- [ ] Task 2
- [ ] Perform a self-review of your code, once you're certain it's 100% complete to the requirements in this phase mark the task as done.
- [ ] STOP and wait for human review

[Additional phases as needed]

## Important Considerations & Requirements

- [ ] Do not over-engineer the solution
- [ ] Do not add placeholder or TODO code
- [ ] [Additional requirements from conversation]
- [ ] [Architectural constraints]
- [ ] [Integration requirements]

## Technical Decisions

[Document any key technical decisions, trade-offs considered, and rationale for chosen approaches]

## Testing Strategy

[Describe testing approach - should be lightweight, fast, and run without external dependencies]

## Debugging Protocol

If issues arise during implementation:

- **Tests fail**: Analyse failure reason and fix root cause, do not work around
- **Performance issues**: Profile and optimise critical paths
- **Integration issues**: Check dependencies and interfaces
- **Unclear requirements**: Stop and seek clarification

## QA Checklist

- [ ] All user instructions followed
- [ ] All requirements implemented and tested
- [ ] No critical code smell warnings
- [ ] Code follows project conventions and standards
- [ ] Documentation is updated and accurate if needed
- [ ] Security considerations addressed
- [ ] Integration points verified (if applicable)
- [ ] [Project-specific QA criteria based on technology stack]
- [ ] [Additional QA criteria from user requirements]
```

## Writing Guidelines

- Use dashes with single spaces for markdown lists: `- [ ] Task`
- Do not include dates or time estimates
- Be clear, concise, and actionable
- Use technical terminology consistently
- Avoid vague language - be specific about what needs to be done

## Testing Philosophy

- Lightweight and fast
- No external dependencies required
- Tests should run in isolation
- Cover critical paths and edge cases
- Integration tests for key workflows (if applicable)

## Final Steps

1. Write the complete `DEVELOPMENT_PLAN.md` file
2. Review the plan thoroughly
3. Make any necessary adjustments
4. Present the plan to the user
5. **STOP** and wait for user review

## Remember

- This is a **planning document**, not implementation
- The user will review and potentially iterate on this plan
- Another AI agent (or you, in a future session) will execute this plan
- Clarity and completeness are paramount but keep it concise
- When in doubt about requirements, ask the user for clarification

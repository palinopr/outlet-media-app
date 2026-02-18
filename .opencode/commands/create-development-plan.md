# Development Plan Creation

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding)
> Use this as a prompt template: paste the relevant sections when you want the agent to create a dev plan.

## Your Task

**Step 0: Scope Assessment**

Before creating a plan, assess whether this work requires a formal development plan and what tier is appropriate.

**Assessment Criteria:**

1. **Complexity indicators** - Does this change:
   - Affect multiple subsystems or cross architectural boundaries?
   - Require breaking changes or API modifications?
   - Impact backwards compatibility or existing integrations?
   - Involve complex business logic or security-critical code?
   - Require changes to data models or database schema?

2. **Scope indicators** - Is this:
   - A single-file change with obvious solution?
   - A focused feature within one subsystem?
   - A multi-system feature requiring coordination?
   - An architectural change affecting core patterns?

3. **Scale indicators**:
   - How many files will likely be touched? (1-2, 3-10, >10)
   - How many new tests will be needed? (None, few, comprehensive suite)
   - How many subsystems are affected? (1, 2-3, >3)

**Decision Tree:**

- **No plan needed**: Single file, <5 tasks, obvious solution -> Just do the work
- **Micro plan** (target <80 lines): Bug fix, dependency update, simple refactor within single subsystem
- **Standard plan** (target 100-250 lines): Focused feature, single subsystem with tests, moderate complexity, 2-4 phases
- **Complex plan** (target 250-400 lines): Multi-system feature, architectural changes, 4-6 phases
- **Too large** (>400 lines projected): Consider splitting into multiple plans

**Step 1: Gather Context**

If there is existing code:
1. Read relevant files in the project directory
2. Examine existing documentation (README.md, docs/, CONTRIBUTING.md, etc.)
3. Analyse codebase structure, dependencies, and package versions
4. Identify coding conventions and patterns currently used
5. Review existing tests to understand expected behaviour

**Step 2: Deep Thinking**

Think deeply about your understanding of the requirements, context, constraints and goal. Consider:
- What is the actual problem being solved? (Not just symptoms)
- What assumptions am I making that should be validated?
- Are there simpler approaches I haven't considered?
- What could go wrong during implementation?
- Does the proposed solution align with existing architecture?

**Step 3: Create the Plan**

Create `DEVELOPMENT_PLAN.md` that SHALL:
1. Concisely and clearly document what needs to be done and why
2. Break work into checklists within logical, reviewable phases
3. Provide enough guidance without over-constraining implementation
4. Set measurable, objective success criteria
5. Be executable by an AI coding agent in a fresh session without further context
6. Include a "Working Notes" section for tracking complex issues
7. Use specification-style language (MUST/SHALL/SHOULD) for requirements

## Plan Template

```markdown
# [Descriptive Plan Title]

## Overview

[What you're building/fixing and why - 2-3 sentences]

## Current State (if applicable)

**Problems Identified:**
- [Specific problem 1]
- [Specific problem 2]

**Technical Context:**
- [Tech stack details with verified package versions]
- [Existing architecture/patterns]
- [Relevant constraints]

## Requirements

**Functional Requirements:**
1. [The system MUST...]
2. [The API SHOULD...]
3. [Users MAY...]

**Technical Constraints:**
1. [Solution MUST maintain backwards compatibility with...]
2. [Response time MUST be <Xms for...]
3. [Code MUST NOT...]

**Prerequisites:**
1. [Dependency X version Y.Z MUST be available]

## Unknowns & Assumptions (if applicable)

**Unknowns:**
- [Things unclear that may need clarification]

**Assumptions:**
- [What we're assuming is true for this plan to work]

## Success Criteria

1. [Measurable criterion 1]
2. [Measurable criterion 2]
3. [Quality gate: linter passes]
4. [Quality gate: tests pass]
5. [Quality gate: build succeeds]

---

## Development Plan

### Phase 1: [Descriptive Phase Name]
- [ ] [Outcome-focused task 1]
  - [ ] [Subtasks if needed]
- [ ] [Outcome-focused task 2]
- [ ] [Verification task]
- [ ] Perform a critical self-review of your changes and fix any issues found
- [ ] STOP and wait for human review

### Phase 2: [Descriptive Phase Name]
- [ ] [Outcome-focused task 1]
- [ ] [Outcome-focused task 2]
- [ ] [Verification task]
- [ ] Perform a critical self-review of your changes and fix any issues found
- [ ] STOP and wait for human review

### Phase [N]: Final Review
- [ ] Run full test suite and verify all tests pass
- [ ] Run linter and fix any issues
- [ ] Build application and verify no errors or warnings
- [ ] Perform critical self-review of all changes
- [ ] Verify all success criteria met

---

## Working Notes (for executing agent use)

[Track complex issues, troubleshooting attempts, and problem-solving progress]
```

## Task Design - The Goldilocks Principle

Tasks should describe **what** needs to be achieved, not **how** to implement it:

- **Too Vague:** "Improve the API"
- **Too Prescriptive:** "In api.ts line 45, change `if (x)` to `if (x && y)`"
- **Just Right:** "Add input validation to all API endpoints, returning 400 errors for invalid requests"

## Red Flags to Avoid

- Trying to rebuild entire systems when simpler solutions exist
- Building custom solutions when battle-tested libraries exist
- Addressing symptoms rather than root causes
- Assuming infrastructure/tools that don't exist
- Plan over 400 lines (split it)

## Before You Finish

- [ ] Scope assessment completed - tier is appropriate for the work
- [ ] Requirements use specification language (MUST/SHALL/SHOULD) and are testable
- [ ] Success criteria are measurable (no vague terms like "better", "robust")
- [ ] 2-6 logical phases with clear progression
- [ ] Each phase ends with "STOP and wait for human review"
- [ ] Tasks describe outcomes, not code implementations
- [ ] Testing integrated throughout, not just at the end
- [ ] Plan length matches tier (<80 micro, 100-350 standard, 350-600 complex)

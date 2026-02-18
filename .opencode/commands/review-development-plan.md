---
description: Review a development plan
---

# Development Plan Review

You are reviewing a development plan created using the "Setup → Plan → Act → Review & Iterate" workflow. Your task is to evaluate the plan's quality and provide constructive feedback to help improve it before development begins.

## Quick Diagnostic Checklist

Before diving into detailed review, quickly assess these critical elements:

- [ ] Plan has clear context explaining the what and why of the goal
- [ ] Specific requirements or constraints are stated
- [ ] Success criteria are measurable and testable
- [ ] Work is broken into distinct phases (typically 3-6)
- [ ] Each phase ends with "STOP and wait for human review" (unless the user has explicitly stated otherwise)
- [ ] Plan length is reasonable (roughly anywhere between 120-400 lines, depending on complexity)
- [ ] Tasks describe outcomes, not specific code changes

If any critical elements are missing, flag them immediately as CRITICAL issues.

## Understanding Feedback Priorities

- **CRITICAL**: Must be fixed before development can proceed (red flags, missing essential components, fundamental flaws)
- **IMPORTANT**: Should be addressed for a strong plan (missing checkpoints, weak success criteria, scope issues)

**Key principle**: Better to identify and explain 2-3 critical issues clearly than to overwhelm with 5+ minor suggestions.

## Your Review Process

### Step 1: Verify Essential Components

1. **Context & Background Information**
   - Clear explanation of the current state
   - Rationale for the proposed changes
   - Relevant technical details about the existing system

2. **Requirements & Constraints**
   - Specific, measurable requirements
   - Technical constraints that must be considered
   - Any dependencies or external factors

3. **Measures of Success**
   - Clear, objective criteria for completion
   - Testable outcomes (e.g., "all tests pass", "build succeeds", "zero TypeScript errors")
   - Quantifiable targets where appropriate (e.g., "80% test coverage", "response time < 200ms")

4. **Phased Development Checklist**
   - Tasks organised into logical phases (typically 3-6 phases)
   - Each task is actionable and specific
   - **CRITICAL**: Each phase must end with "STOP and wait for human review"
   - Each phase has a clear purpose and delivers standalone value
   - Phases follow a logical progression (e.g., setup → core functionality → testing → validation)

### Step 2: Evaluate Quality Characteristics

#### Clarity & Structure
- Is the plan easy to understand and follow?
- Are tasks specific enough that an agent knows what to do?
- Is the scope well-defined and focused?

#### The Goldilocks Principle — Tasks should be:
- **Not too vague**: "Improve the API" → "Add input validation to all API endpoints, returning 400 errors for invalid requests"
- **Not too prescriptive**: "In api.ts line 45, change `if (x)` to `if (x && y)`" → "Add null checking to API handlers to prevent runtime errors"
- **Just right**: Describes the outcome and what success looks like, but lets the agent determine the implementation approach

#### Over-Engineering Risk
- Does the plan focus on practical, necessary improvements?
- Are proposed solutions proportionate to the problems being solved?
- Does it avoid introducing unnecessary complexity or abstractions?

#### Length & Detail
- Typically 120-400 lines; red flag if < 80 lines (likely too vague) or > 600 lines (likely too detailed/ambitious)
- Does it strike a good balance between too vague and too verbose?

### Step 3: Complete Review Checklist

**Essential Components:**
- [ ] Context section clearly explains current state and rationale
- [ ] Requirements or constraints are explicitly stated
- [ ] Success criteria are measurable and testable
- [ ] Plan is organised into distinct phases (typically 2-6)
- [ ] Each phase ends with "STOP and wait for human review"

**Phase Quality:**
- [ ] Each phase has a clear, descriptive name and purpose
- [ ] Phases follow logical progression
- [ ] Each phase delivers standalone, reviewable value
- [ ] Phase scope is appropriate (not too broad, not too granular)
- [ ] Each phase includes verification/testing steps

**Task Quality:**
- [ ] Tasks describe outcomes, not specific code implementations
- [ ] Tasks are actionable and specific enough to execute
- [ ] Tasks include acceptance criteria where appropriate
- [ ] No task is overly large (>8 subtasks) or overly granular
- [ ] Testing is integrated throughout, not just at the end

**Success Criteria Quality:**
- [ ] Success criteria are objective and verifiable
- [ ] Quality gates are specified (tests pass, build succeeds, linting passes)
- [ ] No vague metrics like "better", "improved", "robust", "comprehensive", "enterprise grade"

**Final Phase:**
- [ ] Includes a critical self-review of all changes
- [ ] Verifies all previous phases completed successfully
- [ ] Confirms documentation is updated and concise

### Step 4: Identify Red Flags

**Plans That Need Fundamental Rethinking:**

**Scope Impossibly Ambitious**
- Trying to "rebuild entire authentication system from scratch" when existing libraries would suffice
- Planning to "rewrite entire codebase" without clear justification
- Scope that would take several months to complete

**Wrong Technology or Approach**
- Choosing inappropriate technology for the problem
- Planning to build custom solutions when battle-tested libraries exist
- Ignoring existing project architecture/patterns without justification
- Using outdated libraries, frameworks, or tools

**Solving Non-Existent or Wrong Problem**
- Plan addresses symptoms rather than root cause
- Problem description doesn't match proposed solution
- Fixing something that isn't actually broken

**Common Issues in Otherwise Sound Plans:**

- Too vague: "Improve performance", "Implement comprehensive..." without specifying what or how to measure
- Too prescriptive: Specifying exact code changes rather than outcomes
- No clear phases or logical progression
- Missing "STOP and wait for human review" checkpoints between phases
- No consideration of testing or validation

### Step 5: Provide Feedback

**1. CRITICAL Issues** (Must fix before proceeding)
Label each: `**CRITICAL: [Issue]**`

**2. IMPORTANT Improvements** (Should address for a strong plan)
Label each: `**IMPORTANT: [Issue]**`

**Priority Guidance:**
- If there are 5+ CRITICAL issues, the plan needs fundamental rethinking
- Always prioritise: better to fix 2-3 critical issues well than nitpick over 10 minor ones
- If the plan is good enough, say so — not every plan needs major changes

### Step 6: Offer to Help

After providing feedback, state:

"I can help update your plan to address the improvements I've suggested.
1. **Please review my suggestions**
2. **Let me know if you would like me to revise the plan for you**, and let me know if you made any changes manually before I start (just ask me to re-read the plan)"

## Review Guidelines

- **Be honest but constructive**: Users need real feedback, not just validation
- **Be concise**: Focus on key issues, avoid overwhelming with minor details
- **Be specific**: Point to exact sections when identifying issues
- **Prioritise**: Distinguish between critical issues and minor suggestions
- **Explain the why**: Help users understand the reasoning behind your suggestions

## What Makes Effective Phases?

Good phases should:
1. **Deliver standalone value**: Each phase should produce something reviewable and verifiable
2. **Follow logical progression**: Later phases build on earlier ones
3. **End with verification**: Each phase confirms its work succeeded
4. **Include human review checkpoint**: Every phase must end with "STOP and wait for human review"

## Common Anti-Patterns to Watch For

- "Boil the ocean" plans trying to fix everything at once
- Phases with 10+ tasks (break into sub-phases)
- No testing until the final phase
- Missing error handling considerations
- Plans that read like implementation tutorials
- Scope creep: adding "nice to haves" that aren't core to the goal

## Important Reminders

- **Focus on outcomes, not implementations**
- **Be concise** — Avoid fluff, don't nitpick, don't waste tokens
- Plans are guides, not rigid specifications — some flexibility is good
- A perfect plan isn't necessary, but a clear, achievable plan is

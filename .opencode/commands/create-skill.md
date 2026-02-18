---
description: Create or edit a skill with guided assistance and best practices
argument-hint: "[skill name or path]"
---

# Skill Builder Assistant

You are helping the user create or edit a skill. Skills are modular capabilities that an AI agent automatically invokes when relevant to the user's request (unlike slash commands which are manually triggered).

## Understanding Skills

**What Skills Are:**
- Autonomous capabilities stored as SKILL.md files with optional supporting files
- Triggered automatically by the agent based on the description matching user requests
- Can be global/personal or project-level (`.opencode/skills/`)

**Skills vs Commands:**
- Skills: Invoked automatically when relevant
- Commands: User-triggered manually

**Why Skills Exist:**
Skills extend the agent's capabilities with specialised knowledge or procedures that aren't in the training dataset. They're dynamically loaded only when needed, avoiding token cost. This means:
- Skills should include ALL contextual information needed to perform the task
- They provide domain-specific knowledge (APIs, workflows, standards) too large to always include in context
- They enable capabilities that require up-to-date or project-specific information

## Initial Discovery Phase

Before creating or editing a skill, ask the user:

1. **What task or capability should this skill handle?**
   - Focus on ONE specific capability
   - Understand the user's workflow, pain points, and the context they're trying to add

2. **When should the agent invoke this skill?**
   - What keywords or scenarios trigger it?
   - This informs the description field

3. **What scope is needed?**
   - Global/personal skill — available in all projects
   - Project skill (`.opencode/skills/`) — project-specific, only available in that repo

4. **What contextual information is needed?**
   - Does this require domain-specific knowledge not in the agent's training data?
   - Are there specific APIs, workflows, or standards to document?
   - Does the user have documentation or examples to include?
   - What background knowledge is essential for performing this task?

5. **What tools should it use?** (optional, only ask if the user mentions specific tools)

## Skill Structure Requirements

### Frontmatter (YAML)

Required fields:
```yaml
---
name: Skill Name Here
description: Third-person description of what the skill does and when to use it
---
```

Optional fields:
```yaml
allowed-tools: [Read, Write, Edit, Bash]  # Restrict tools for security (only add upon user request)
model: openai/gpt-4o                      # Override default model (only add upon user request)
```

### Naming Rules

**name field:**
- Maximum 64 characters
- Use gerund form (verbs ending in -ing): "Processing PDFs", "Analysing Logs"
- **Be specific** — do not use generic or vague names

**description field:**
- Maximum 1024 characters
- Written in third person: "This skill helps..." not "I help..."
- MUST include BOTH:
  - What the skill does
  - When to use it (trigger conditions/keywords)
- Example: "This skill analyses application logs for errors and patterns. Use when debugging issues, investigating failures, or reviewing system behaviour."

## Content Guidelines

### Keep SKILL.md Focused and Concise

- Target: Under 500 lines for SKILL.md
- Every sentence should justify its token cost
- Use progressive disclosure: reference separate files for detailed content
- **Be concise but complete**: Include ALL contextual information needed to perform the task
- Avoid verbosity, but don't omit critical context, terminology, or procedures

### Specificity Levels

Match detail level to task fragility:

- **High freedom** (flexible tasks): Text instructions, general guidance
- **Medium freedom** (preferred patterns): Pseudocode, workflow steps
- **Low freedom** (error-prone): Specific commands, exact scripts

### Organisation Patterns

If the skill needs extensive content, split into separate files:

**Pattern 1 — Reference Model:**
- SKILL.md: High-level guide (loaded when triggered)
- forms.md: Templates and formats (loaded as needed)
- reference.md: Detailed documentation (loaded as needed)
- scripts/*.py/sh: Utility scripts (executed, not loaded)

**Pattern 2 — Domain Split:**
- SKILL.md: Overview and routing
- finance-data.md: Finance-specific handling
- sales-data.md: Sales-specific handling

**Key rule**: Keep references ONE level deep from SKILL.md

### Content to Include

- **Clear workflows**: Sequential steps with validation loops
- **Templates**: Show exact output format expected
- **Examples**: Concrete demonstrations
- **Edge cases**: Common failure scenarios
- **Validation steps**: How to verify success

### Content to Avoid

- Time-sensitive information (dates, versions that change)
- Inconsistent terminology
- Over-general advice that doesn't guide behaviour
- Context or background not related to the skill's purpose
- Duplicated information across files within the skill
- Vague names

## Implementation Steps

Once you understand the requirements:

1. **Check for existing skills**
   - Look in `.opencode/skills/`
   - Avoid duplicating functionality

2. **Draft the frontmatter**
   - Write a compelling, specific description
   - Set appropriate tool restrictions (if required)

3. **Write core instructions**
   - Start with essential workflow
   - Use clear, direct language
   - Include examples

4. **Add supporting files if needed**
   - Create separate files for large content
   - Reference them from SKILL.md

5. **Create the skill file(s)**
   - Place in `.opencode/skills/` for project-level
   - Ensure SKILL.md exists with proper frontmatter
   - If adding supplemental markdown files, reference and describe them in SKILL.md

6. **Validation checklist:**
   - [ ] Name is gerund form, under 64 characters
   - [ ] Description is third person, under 1024 characters
   - [ ] Description explains BOTH what and when
   - [ ] SKILL.md is under 500 lines
   - [ ] Includes necessary contextual information (APIs, terminology, procedures)
   - [ ] Concise writing without unnecessary verbosity
   - [ ] Instructions are clear and actionable
   - [ ] Examples provided for complex outputs

## Remember

- The description is how the agent decides when to invoke the skill — make it precise
- SKILL.md is loaded into context when the skill is triggered; other .md files are loaded as needed but must be referenced in SKILL.md
- Don't be vague or generic with the skill name or description
- If you add additional markdown files, ensure they are referenced in SKILL.md

## Examples of Well-Scoped Skills

**Good:** "Processing PDF Documents — Extracts text, tables, and images from PDF files. Use when analysing PDF content, converting documents, or extracting structured data."

**Too broad:** "Helping with Documents — Assists with various document tasks."

**Good:** "Analysing Git History — Reviews commit patterns, identifies contributors, and summarises changes. Use when investigating code evolution, preparing changelogs, or auditing contributions."

**Too narrow:** "Counting Commits — Counts the number of commits in a repository."

## Your Task

1. Ask the discovery questions above
2. Draft the skill structure based on their answers
3. Show them the complete SKILL.md content
4. Create the file(s) in the appropriate location
5. Provide testing suggestions

Focus on creating a single, well-defined capability that the agent can reliably invoke when appropriate.

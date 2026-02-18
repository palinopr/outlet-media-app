# Skill / Instruction Document Creator

Guide for creating effective instruction documents (skills) that extend an AI agent's capabilities with specialised knowledge, workflows, or tool integrations. Use when creating or updating instruction documents for repeatable tasks.

## What Skills Provide

1. Specialised workflows -- multi-step procedures for specific domains
2. Tool integrations -- instructions for working with specific file formats or APIs
3. Domain expertise -- company-specific knowledge, schemas, business logic
4. Bundled resources -- scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Skills share it with system prompts, conversation history, and user requests.

**Default assumption: the AI is already very smart.** Only add context it doesn't already have. Challenge each piece of information: "Does the agent really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match specificity to the task's fragility and variability:

- **High freedom (text-based instructions)**: Multiple approaches valid, decisions depend on context
- **Medium freedom (pseudocode or scripts with parameters)**: Preferred pattern exists, some variation acceptable
- **Low freedom (specific scripts, few parameters)**: Operations are fragile, consistency critical, specific sequence required

Think of the AI exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

### Skill Anatomy

```
skill-name/
  SKILL.md (required)
    - Metadata: name + description (always loaded, ~100 tokens)
    - Body: Instructions (loaded when activated, <5000 tokens recommended)
  scripts/          (optional) Executable code for deterministic tasks
  references/       (optional) Documentation loaded on demand
  assets/           (optional) Static resources (templates, images, data files)
```

## Progressive Disclosure

Skills use three-level loading to manage context efficiently:

1. **Metadata** (~100 words) -- name + description, always in context
2. **Instructions** (<5k words) -- full body, loaded when skill triggers
3. **Resources** (as needed) -- scripts, references, assets loaded only when required

Keep the main instruction file under 500 lines. Move detailed reference material to separate files.

### Patterns

**Pattern 1: High-level guide with references**
```markdown
# PDF Processing
## Quick start
[code example]
## Advanced features
- Form filling: See references/FORMS.md
- API reference: See references/REFERENCE.md
```

**Pattern 2: Domain-specific organisation**
```
bigquery-skill/
  SKILL.md (overview and navigation)
  references/
    finance.md
    sales.md
    product.md
```

**Pattern 3: Conditional details**
```markdown
# DOCX Processing
## Creating documents
Use docx-js. See references/DOCX-JS.md.
## Editing documents
For simple edits, modify XML directly.
For tracked changes: See references/REDLINING.md
```

## Creation Process

### Step 1: Understand with Concrete Examples

Clarify how the skill will be used:
- What functionality should it support?
- What would a user say that should trigger it?
- What are example inputs and expected outputs?

### Step 2: Plan Reusable Contents

For each example, identify what scripts, references, and assets would be helpful:
- Code rewritten repeatedly -> `scripts/`
- Documentation referenced during work -> `references/`
- Files used in output -> `assets/`

### Step 3: Create the Skill Structure

Create the directory and main instruction file.

### Step 4: Write Instructions

**Description** should include:
- What the skill does
- Specific triggers/contexts for when to use it
- All "when to use" information (this is the primary triggering mechanism)

**Body** should include:
- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases
- References to supporting files

**Do NOT include:** README files, installation guides, changelogs, or user-facing docs. Only include information the AI agent needs to do the job.

### Step 5: Iterate Based on Real Usage

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Update instructions or bundled resources
4. Test again

## Writing Guidelines

- Use imperative/infinitive form
- Information should live in either the main file or references, not both
- Keep only essential procedural instructions in the main file
- Move detailed reference material to separate files
- Avoid deeply nested references -- keep one level deep
- For files longer than 100 lines, include a table of contents

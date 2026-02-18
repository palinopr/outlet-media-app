# Agent Skills Specification

Reference specification for the Agent Skills format. Sourced from [agentskills.io/specification](https://agentskills.io/specification).

## Directory Structure

A skill is a directory containing at minimum a `SKILL.md` file:

```
skill-name/
  SKILL.md          # Required
  scripts/           # Optional - executable code
  references/        # Optional - documentation for on-demand loading
  assets/            # Optional - static resources (templates, images, data)
```

## SKILL.md Format

The `SKILL.md` file must contain YAML frontmatter followed by Markdown content.

### Frontmatter (Required)

```yaml
---
name: skill-name
description: A description of what this skill does and when to use it.
---
```

With optional fields:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
license: Apache-2.0
compatibility: Requires git, docker, jq, and access to the internet
metadata:
  author: example-org
  version: "1.0"
allowed-tools: Bash(git:*) Bash(jq:*) Read
---
```

### Field Reference

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars. Lowercase letters, numbers, hyphens only. Must not start/end with hyphen. Must match parent directory name. |
| `description` | Yes | Max 1024 chars. Non-empty. Describes what the skill does and when to use it. |
| `license` | No | License name or reference to a bundled license file. |
| `compatibility` | No | Max 500 chars. Environment requirements (target product, system packages, network access). |
| `metadata` | No | Arbitrary key-value mapping for additional metadata. |
| `allowed-tools` | No | Space-delimited list of pre-approved tools. Experimental. |

### Name Rules

- 1-64 characters
- Unicode lowercase alphanumeric and hyphens only (`a-z` and `-`)
- Must not start or end with `-`
- Must not contain consecutive hyphens (`--`)

```
name: pdf-processing     # valid
name: data-analysis      # valid
name: PDF-Processing     # invalid (uppercase)
name: -pdf               # invalid (starts with hyphen)
name: pdf--processing    # invalid (consecutive hyphens)
```

### Description Guidelines

Should describe both what the skill does and when to use it. Include specific keywords that help agents identify relevant tasks.

Good:
```
description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
```

Poor:
```
description: Helps with PDFs.
```

### Body Content

The Markdown body after the frontmatter contains the skill instructions. No format restrictions. Write whatever helps agents perform the task effectively.

Recommended sections:
- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases

The agent loads this entire file once it decides to activate a skill. Consider splitting longer content into referenced files.

## Optional Directories

### scripts/

Executable code that agents can run. Scripts should:
- Be self-contained or clearly document dependencies
- Include helpful error messages
- Handle edge cases gracefully

Supported languages depend on the agent implementation. Common: Python, Bash, JavaScript.

### references/

Additional documentation agents can read when needed:
- `REFERENCE.md` -- detailed technical reference
- `FORMS.md` -- form templates or structured data formats
- Domain-specific files (`finance.md`, `legal.md`, etc.)

Keep individual reference files focused. Agents load these on demand, so smaller files mean less context usage.

### assets/

Static resources:
- Templates (document templates, configuration templates)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

## Progressive Disclosure

Skills should be structured for efficient context usage:

1. **Metadata** (~100 tokens): `name` and `description` loaded at startup for all skills
2. **Instructions** (<5000 tokens recommended): Full `SKILL.md` body loaded when skill is activated
3. **Resources** (as needed): Files in `scripts/`, `references/`, `assets/` loaded only when required

Keep main `SKILL.md` under 500 lines. Move detailed reference material to separate files.

## File References

When referencing other files in a skill, use relative paths from the skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.
Run the extraction script: scripts/extract.py
```

Keep file references one level deep from `SKILL.md`. Avoid deeply nested reference chains.

## Validation

Use the [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) reference library to validate skills:

```bash
skills-ref validate ./my-skill
```

Checks that `SKILL.md` frontmatter is valid and follows all naming conventions.

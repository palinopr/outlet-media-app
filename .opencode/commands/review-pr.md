# Review Pull Request

Review the specified pull request and provide feedback. Optionally post the review to GitHub.

## Arguments

- `$ARGUMENTS`: The PR number or URL to review

## Steps

### 1. Checkout the PR

```
gh pr checkout $ARGUMENTS
```

### 2. Gather PR context

```
gh pr view $ARGUMENTS
gh pr diff $ARGUMENTS
```

### 3. Review the code changes

Using the code-reviewer agent (or inline review), analyse the diff for:
- Code quality and best practices
- Potential bugs or issues
- Security concerns
- Performance considerations
- Documentation and comments

### 4. Present the review

```
## PR Review

**Recommendation**: APPROVE | REQUEST_CHANGES | COMMENT

### Summary
[1-2 sentence overview of what this PR does]

### Actionable Feedback (N items)
- [ ] `file.py:42` - Description of issue or required change
- [ ] `file.ts:15` - Description

### Detailed Review

#### Code Quality
[Analysis of code patterns, readability, maintainability]

#### Security
[Any security considerations]

#### Suggestions
[Optional improvements]

#### Positive Notes
[What was done well]
```

**Guidelines:**
- Use checkboxes for actionable items so authors can track progress
- Be specific with file:line references where possible

### 5. Ask about posting

Ask the user:
- Whether they want to post this review to GitHub
- What review action to take: APPROVE, REQUEST_CHANGES, or COMMENT

### 6. Post the review (if confirmed)

```
gh pr review $ARGUMENTS --body "YOUR_REVIEW_BODY" --approve|--request-changes|--comment
```

When posting to GitHub, wrap the Detailed Review section in a collapsible `<details>` tag:

```markdown
## PR Review

**Recommendation**: APPROVE | REQUEST_CHANGES | COMMENT

### Summary
[summary]

<details>
<summary>Actionable Feedback (N items)</summary>

- [ ] items...

</details>

<details>
<summary>Detailed Review</summary>

[full review content]

</details>
```

Use the appropriate flag:
- `--approve` for APPROVE
- `--request-changes` for REQUEST_CHANGES
- `--comment` for COMMENT only

**Note:** `gh pr review` produces no output on success. Run this command once — no output means success.

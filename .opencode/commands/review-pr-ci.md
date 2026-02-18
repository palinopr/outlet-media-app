# Review Pull Request (CI/Automated)

Review a pull request and post the review to GitHub. Designed for CI/automated environments — no user interaction.

## Arguments

- `$ARGUMENTS`: The PR number to review

## Steps

### 1. Gather PR context

```
gh pr view $ARGUMENTS
gh pr diff $ARGUMENTS
```

### 2. Review the code changes

Analyse the diff for:
- Code quality and best practices
- Potential bugs or issues
- Security concerns
- Performance considerations
- Documentation and comments

### 3. Determine review outcome

- **APPROVE** (`--approve`): No significant issues found
- **REQUEST_CHANGES** (`--request-changes`): Critical issues that must be fixed before merging
- **COMMENT** (`--comment`): Suggestions or minor issues that don't block merging

### 4. Post the review

```
gh pr review $ARGUMENTS --body "YOUR_REVIEW_BODY" --approve|--request-changes|--comment
```

Format the review body using collapsible sections:

```markdown
## PR Review

**Recommendation**: APPROVE | REQUEST_CHANGES | COMMENT

### Summary
[1-2 sentence overview of what this PR does]

<details>
<summary>Actionable Feedback (N items)</summary>

- [ ] `file.py:42` - Description of issue or required change
- [ ] `file.ts:15` - Description
- [ ] General: Description of non-file-specific feedback

</details>

<details>
<summary>Detailed Review</summary>

### Code Quality
[Analysis of code patterns, readability, maintainability]

### Security
[Any security considerations or concerns]

### Suggestions
[Optional improvements that aren't blocking]

### Positive Notes
[What was done well - be specific]

</details>
```

**Guidelines:**
- Keep summary and actionable feedback visible (outside collapsed sections)
- Put detailed analysis in the collapsed section to reduce noise
- Use checkboxes in actionable feedback so authors can track progress

**Note:** `gh pr review` produces no output on success. Run this command once — no output means success.

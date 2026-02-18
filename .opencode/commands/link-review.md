# Link Review

Review links in changed files for quality and security issues.

**IMPORTANT**: Only review the files explicitly listed in the prompt. Do not search for or review additional files.

## Link Quality Checks

1. **Broken Links** — Identify any links that might be broken or malformed
2. **Outdated Links** — Check for links to deprecated resources or old documentation
3. **Security** — Ensure no links to suspicious or potentially harmful sites
4. **Best Practices**:
   - Links should use HTTPS where possible
   - Internal links should use relative paths
   - External links should point to stable, reputable sources

## Report Format

Provide a clear summary with:
- ✅ Valid and well-formed links
- ⚠️ Links that might need attention (e.g., HTTP instead of HTTPS, potentially stale docs)
- ❌ Broken or problematic links that must be fixed

If all links look good, provide a brief confirmation.

## Posting

Post the review as a comment on the pull request:
```
gh pr comment $PR_NUMBER --body "your review content"
```

# Code Review

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding)

**When to use:** After completing multiple complex software development tasks, before informing the user that work is complete.

## Guidelines For Performing Code Reviews

### Process

1. **Perform a critical self-review** of the changes you've made
2. **Compile findings** into a concise numbered list with severity (critical/medium/low)
3. **Verify each finding** against actual code (no false positives)
4. **Implement all fixes** and run the appropriate lint/test/build pipeline

### Review Checklist

When reviewing your changes, check for:

**Correctness:**
- Does the code do what was requested?
- Are there off-by-one errors, null reference issues, or edge cases?
- Are error paths handled?

**Security:**
- No hardcoded secrets or credentials
- User input is validated and sanitised
- SQL uses parameterised queries

**Quality:**
- Functions under 50 lines
- Files under 700 lines
- No dead code or debug statements left behind
- Comments explain "why", not "what"

**Testing:**
- Tests cover the new functionality
- Tests cover edge cases and error paths
- No tests testing mock behaviour (see testing-anti-patterns.md)

**Performance:**
- No obvious performance issues (N+1 queries, unnecessary loops)
- Appropriate data structures used

### Output Format

Keep outputs concise, token-efficient, relevant and actionable:
- Focus on your changes, not nitpicking minor style issues
- Appropriately scope the review to your changes with clear boundaries
- Severity levels: **critical** (must fix), **medium** (should fix), **low** (nice to fix)

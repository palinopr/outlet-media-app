# Self-Review Protocol

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding)
> Use after implementing changes, before reporting completion.

## Checklist

Perform a critical self-review of all changes:

1. **Correctness** - Does the code do what was requested? Edge cases handled?
2. **Security** - No hardcoded secrets, input validated, SQL parameterised?
3. **Quality** - Functions <50 lines, files <700 lines, no dead code, no debug statements?
4. **Testing** - New tests cover the changes? Edge cases and error paths tested?
5. **Performance** - No obvious issues (N+1 queries, unnecessary loops)?
6. **Build** - Linting passes, code builds, all tests pass (new + existing)?

If issues found: fix them before reporting completion.
If everything passes: report what was done and verify against original requirements.

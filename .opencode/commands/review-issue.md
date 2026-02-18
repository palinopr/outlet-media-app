# Review GitHub Issue

Review and respond to a GitHub issue. Classify it, draft an appropriate response, and optionally take action.

## Arguments

- `$ARGUMENTS`: The issue number to review

## Steps

### 1. Gather issue context

```bash
gh issue view $ARGUMENTS --json number,title,body,author,labels,state,comments,createdAt
```

### 2. Classify the issue

1. **Spam/Noise** — Gibberish, test posts, off-topic content, or malicious intent
2. **Bug Report** — Reports broken code, links, or incorrect information
3. **Feature Proposal** — Proposes new content or significant additions
4. **Question** — Asks about usage, API behaviour, or seeks clarification
5. **Community Resource** — Shares an external project or resource
6. **Duplicate** — Issue already exists or has been addressed

### 3. Check for related context

If the issue references specific files or code:
- Read the referenced files to understand context
- Verify whether the issue is valid
- Look for related issues or PRs that may address it

### 4. Draft a response

#### Spam/Noise
- Recommend closing without comment
- Flag any security concerns

#### Bug Reports
- Acknowledge the report and thank the reporter
- Verify the issue if possible
- If valid and simple: invite them to submit a PR
- If valid and complex: acknowledge and indicate it's on the radar
- If already fixed: reference the fix (PR/commit)

#### Feature Proposals
- Thank them for the proposal
- Evaluate against criteria: is it practical, differentiated, and focused on the project's scope?
- If promising: express interest, ask clarifying questions if needed
- If not a fit: politely explain why, redirect to appropriate resources

#### Questions
- Provide helpful, direct answers when possible
- Link to relevant documentation
- Reference specific code examples if applicable
- Suggest appropriate community channels for ongoing discussion

#### Community Resources
- Thank them for sharing but redirect to better venues
- Issues are for bug reports and proposals, not community showcases
- Close the issue after redirecting

#### Duplicates
- Reference the original issue/PR
- Close as duplicate if appropriate

### 5. Suggest labels

- `bug` — Bug reports
- `enhancement` — Feature requests or proposals
- `question` — Questions
- `documentation` — Docs improvements
- `duplicate` — Already exists
- `wontfix` — Won't be addressed
- `good first issue` — Simple fixes for new contributors

### 6. Present the review

1. **Issue Summary** — Brief description of what the issue is about
2. **Classification** — What type of issue this is
3. **Validity Check** — Whether the issue is valid/actionable
4. **Suggested Response** — Draft comment to post
5. **Suggested Labels** — Labels to add
6. **Suggested Action** — Whether to comment, close, or take other action

### 7. Get confirmation

Ask the user whether to:
- Post the drafted response
- Add the suggested labels
- Close the issue (if appropriate)

### 8. Take action (if confirmed)

**Post a comment:**
```bash
gh issue comment $ARGUMENTS --body "YOUR_RESPONSE"
```

**Add labels:**
```bash
gh issue edit $ARGUMENTS --add-label "label1,label2"
```

**Close an issue:**
```bash
gh issue close $ARGUMENTS --reason "not planned"
```

Or with a comment:
```bash
gh issue close $ARGUMENTS --comment "Closing because..."
```

## Response Tone Guidelines

- Professional, friendly, and concise
- Thank contributors for their engagement
- Direct but not dismissive when declining proposals
- Provide actionable next steps when possible
- Link to resources rather than explaining everything inline
- Don't over-explain or be overly apologetic

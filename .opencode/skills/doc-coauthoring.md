# Doc Co-Authoring Workflow

Structured workflow for collaborative document creation. Use when writing documentation, proposals, technical specs, decision docs, or similar structured content. Helps efficiently transfer context, refine content through iteration, and verify the doc works for readers.

## When to Offer This Workflow

Trigger conditions:
- User mentions writing documentation: "write a doc", "draft a proposal", "create a spec"
- User mentions specific doc types: "PRD", "design doc", "decision doc", "RFC"
- User seems to be starting a substantial writing task

Offer the three stages:
1. **Context Gathering**: User provides all relevant context while clarifying questions are asked
2. **Refinement & Structure**: Iteratively build each section through brainstorming and editing
3. **Reader Testing**: Test the doc with fresh eyes to catch blind spots

## Stage 1: Context Gathering

**Goal:** Close the gap between what the user knows and what the agent knows.

### Initial Questions

1. What type of document is this? (technical spec, decision doc, proposal)
2. Who's the primary audience?
3. What's the desired impact when someone reads this?
4. Is there a template or specific format to follow?
5. Any other constraints or context to know?

### Info Dumping

Encourage the user to dump all context:
- Background on the project/problem
- Related discussions or documents
- Why alternative solutions aren't being used
- Organisational context (team dynamics, past incidents)
- Timeline pressures or constraints
- Technical architecture or dependencies
- Stakeholder concerns

Advise them not to worry about organising it.

### Clarifying Questions

When user signals they've done their initial dump, generate 5-10 numbered questions based on gaps. Let them answer in shorthand (e.g., "1: yes, 2: no because backwards compat").

**Exit condition:** Sufficient context gathered when edge cases and trade-offs can be discussed without needing basics explained.

## Stage 2: Refinement & Structure

**Goal:** Build the document section by section through brainstorming, curation, and iterative refinement.

### For Each Section:

#### Step 1: Clarifying Questions
Ask 5-10 clarifying questions about what should be included.

#### Step 2: Brainstorming
Brainstorm 5-20 things that might be included. Look for:
- Context shared that might have been forgotten
- Angles or considerations not yet mentioned

#### Step 3: Curation
Ask which points to keep, remove, or combine. Request brief justifications:
- "Keep 1,4,7,9"
- "Remove 3 (duplicates 1)"
- "Combine 11 and 12"

#### Step 4: Gap Check
Ask if anything important is missing.

#### Step 5: Drafting
Draft the section based on selections. Ask the user to indicate what to change rather than editing directly -- this helps learn their style for future sections.

#### Step 6: Iterative Refinement
Make surgical edits based on feedback. After 3 iterations with no substantial changes, ask if anything can be removed without losing important information.

### Near Completion

When 80%+ of sections are done, re-read the entire document and check for:
- Flow and consistency across sections
- Redundancy or contradictions
- Anything that feels like generic filler
- Whether every sentence carries weight

## Stage 3: Reader Testing

**Goal:** Test if the document actually works for readers.

### Step 1: Predict Reader Questions
Generate 5-10 questions readers would realistically ask.

### Step 2: Test
Either test with a fresh conversation (no context bleed), or have the user test manually:
1. Open a fresh conversation
2. Paste the document
3. Ask the generated questions
4. Check if answers are correct

### Step 3: Additional Checks
Ask the fresh reader:
- "What in this doc might be ambiguous or unclear?"
- "What knowledge does this doc assume readers already have?"
- "Are there any internal contradictions?"

### Step 4: Iterate
Fix any gaps found and re-test problematic sections.

**Exit condition:** Reader consistently answers questions correctly with no new gaps.

## Final Review

1. Recommend a final read-through -- the user owns this document
2. Suggest double-checking facts, links, and technical details
3. Verify it achieves the intended impact
4. Suggest using appendices for depth without bloating the main doc

# Expert Prompt Enhancer

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding)

**When to use:** When the user explicitly asks to improve, refine, or rewrite their prompt, or requests help framing a request for another AI system.

Transform prompts written by non-specialists into the form a domain expert would use to make the same request.

## Why This Matters

AI output quality correlates strongly with input sophistication. A vaguely-worded request yields generic output; an expert-framed request yields expert-quality output. This skill bridges that gap without changing *what* someone asks for - only *how* it's expressed.

## Expert Communication Patterns

| Pattern           | Novice               | Expert                                        |
|-------------------|----------------------|-----------------------------------------------|
| **Precision**     | "make it faster"     | "optimise page load performance"              |
| **Decomposition** | Single vague request | Broken into logical components                |
| **Constraints**   | Unstated             | Explicit limits, trade-offs, success criteria |
| **Context**       | Missing              | System fit, standards, prior attempts         |
| **Role framing**  | None                 | "As a database architect, review this schema" |
| **Failure modes** | Ignored              | Anticipated and specified                     |

## What Expert Communication Looks Like

**They name things precisely.** Experts use domain-specific terminology because it's unambiguous. "Optimise page load performance" vs "make it faster".

**They decompose problems.** Experts break requests into logical components, identify dependencies, and sequence appropriately.

**They specify constraints and success criteria.** Experts state what limits apply, what trade-offs are acceptable, and what "done" looks like in measurable terms.

**They establish context.** Experts situate problems: what system does this fit into, what standards apply, why does this matter, what's been tried before.

**They assign appropriate roles.** "As a database architect, review this schema" rather than "look at this database stuff".

**They anticipate failure modes.** Experts know what can go wrong and specify what to avoid or handle.

## Transformation Process

1. **Identify the domain** - Who would professionally handle this? What terminology and standards apply?
2. **Find core intent** - What does the user actually want beneath imprecise language?
3. **Surface ambiguity** - Fill obvious gaps with reasonable defaults. Only flag genuine ambiguities where guessing could go wrong.
4. **Apply expert patterns** - Precise terminology, decomposition, constraints, success criteria, role framing.
5. **Match complexity to task** - A simple question needs clarity, not PhD-level complexity.

## Examples

**Original:** "Help me eat healthier"

**Expert rewrite:** "I want to improve my eating habits sustainably. Rather than a strict diet plan, give me: the highest-impact changes that nutrition research actually supports (not fads), practical strategies for implementation that account for real-world constraints like time and budget, how to think about trade-offs (e.g., when 'good enough' beats 'perfect'), and common pitfalls that derail people. I'm more interested in building lasting habits than optimising for rapid results."

---

**Original:** "Help me negotiate my salary"

**Expert rewrite:** "I need to negotiate salary for a job offer. Walk me through: how to research and establish my market value, the psychology of negotiation (anchoring, framing, reciprocity) applied to compensation discussions, specific language and tactics that work in salary conversations, common mistakes that weaken negotiating position, and how to handle common employer responses (budget constraints, equity offers, delayed reviews). Include how to negotiate non-salary elements if base salary is genuinely fixed."

---

**Original:** "I need a Python script to clean up my data"

**Expert rewrite:** "Help me write a Python script for data cleaning. I'll share a sample of the data - from that, identify the data quality issues present (missing values, duplicates, inconsistent formats, outliers, encoding problems) and write cleaning code that handles each. Use pandas. Include validation that confirms the cleaning worked. Structure the code so each cleaning step is separate and commented, making it easy to modify for my specific needs."

---

**Original:** "Make my website faster"

**Expert rewrite:** "Analyse website performance and provide prioritised optimisation recommendations. Assess the main performance dimensions: server response time, render-blocking resources, asset optimisation (images, scripts, stylesheets), caching strategy, and third-party script impact. For each issue identified, explain the problem, the fix, and the expected impact. Prioritise by effort-to-impact ratio. I'll provide the URL or performance data."

## Your Transformation Approach

1. **Identify the domain and who would professionally handle this request.** This tells you what terminology, standards, and mental models apply.
2. **Find the core intent beneath imprecise language.** What does the user actually want to achieve or understand?
3. **Identify what's implicit or ambiguous.** Distinguish between gaps you can fill with reasonable defaults (do this) and genuine ambiguities where guessing could go badly wrong (flag these).
4. **Reframe using expert patterns:** precise terminology, appropriate decomposition, explicit constraints, success criteria, and role framing where helpful.
5. **Match complexity to the task.** A simple question needs professional-level clarity, not PhD-level complexity. Don't inflate.

## Constraints

- **Preserve intent absolutely.** You elevate how something is asked, never what is asked.
- **Don't invent requirements.** Fill obvious gaps with reasonable defaults; don't add things the user didn't imply.
- **Make reasonable assumptions rather than asking the user to specify everything.** The goal is to improve prompts without creating work for the user.
- **Use correct terminology, not impressive terminology.** Domain language should clarify, not obscure or intimidate.

## Output

Provide the expert rewrite. If you made assumptions about ambiguous elements, or if there are meaningful alternative framings the user might prefer, note these briefly after the rewrite.

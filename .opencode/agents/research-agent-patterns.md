# Research Agent Patterns

Reference patterns for orchestrator-subagent research workflows. Use when designing or implementing multi-agent research systems.

Source: Adapted from `anthropics/claude-cookbooks/patterns/agents/prompts/`.

---

## Query Classification

Before planning a research process, classify the query type:

### Depth-first query
The problem requires multiple perspectives on a single issue — "go deep" by analysing one topic from many angles.

- Benefits from parallel agents exploring different viewpoints or methodologies
- The core question is singular but benefits from diverse approaches
- Examples:
  - "What are the most effective treatments for depression?" (parallel agents per treatment type)
  - "What caused the 2008 financial crisis?" (economic, regulatory, behavioural, historical perspectives)
  - "What is the best approach to building AI finance agents in 2025?"

### Breadth-first query
The problem breaks into distinct, independent sub-questions — "go wide" by gathering information about each sub-question in parallel.

- Benefits from parallel agents each handling separate sub-topics
- The query divides naturally into independent research streams
- Examples:
  - "Compare the economic systems of three Nordic countries" (one agent per country)
  - "What are the net worths of all Fortune 500 CEOs?" (split into batches)
  - "Compare all major frontend frameworks on performance, learning curve, and adoption" (identify frameworks, then research each)

### Straightforward query
Focused, well-defined — can be answered by a single investigation or fetching a single resource.

- Can be handled effectively by a single agent with clear instructions
- Does not benefit from extensive parallelisation
- Examples:
  - "What is the current population of Tokyo?"
  - "What are all the Fortune 500 companies?"
  - "Tell me about bananas"

---

## Subagent Count Guidelines

| Complexity | Count | Example |
|---|---|---|
| Simple / straightforward | 1 | "When is the tax deadline?" |
| Standard | 2–3 | "Compare the top 3 cloud providers" |
| Medium | 3–5 | "Analyse AI impact on healthcare" |
| High | 5–10 (max 20) | "Fortune 500 CEO birthplaces and ages" |

**Never create more than 20 subagents.** If a task seems to require more, restructure to consolidate similar sub-tasks. More subagents = more overhead. Only add subagents when they provide distinct value.

---

## Orchestrator (Lead Agent) Responsibilities

The lead agent **coordinates and synthesises** — it does not conduct primary research itself.

1. **Classify** the query (depth-first / breadth-first / straightforward)
2. **Plan** the research process with clear task allocation
3. **Deploy** subagents with extremely detailed, specific instructions
4. **Monitor** progress and adapt based on results
5. **Synthesise** findings into a final report

### Deploying Subagents Effectively

Each subagent task description must include:
- Specific research objectives (ideally 1 core objective per subagent)
- Expected output format (list, report, specific answer, etc.)
- Relevant background context
- Key questions to answer
- Suggested starting points and sources
- What constitutes a reliable source for this task
- Scope boundaries to prevent research drift

**Parallelise whenever possible.** Deploy independent subagents simultaneously.

### When NOT to Deploy a Subagent

- Simple calculations you can do inline
- Basic formatting
- Tasks that don't require external research
- When further research has diminishing returns and you can already give a good answer — stop and write the report

---

## Subagent (Research Worker) Responsibilities

The subagent **executes focused research** and returns a dense, accurate report.

### Research Loop

Use an OODA loop:
1. **Observe** — what information has been gathered; what still needs gathering
2. **Orient** — which tools and queries would best fill the gaps
3. **Decide** — choose a specific tool and query
4. **Act** — execute, then evaluate results

### Research Budget

Calibrate tool calls to query complexity:
- Simple tasks: under 5 tool calls
- Medium tasks: ~5–10 tool calls
- Complex/multi-part tasks: up to 15 tool calls
- Hard limit: 20 tool calls maximum

### Source Quality

Think critically about results — do not take them at face value. Flag:
- Speculation presented as fact (future tense, "could", "may", predictions)
- Marketing language
- Unconfirmed reports or passive voice with unnamed sources
- News aggregators over primary sources
- Cherry-picked or misleading data

Report conflicting information to the lead agent rather than resolving it silently.

### Reporting

Return a dense, accurate, information-rich report covering:
- All facts gathered relevant to the task
- Source quality notes where relevant
- Any conflicting information with context
- Gaps where information was not available

---

## Citations Agent Pattern

A specialised post-processing agent that adds inline citations to a completed research report.

**Inputs:** A completed research report (without citations) and the sources used.

**Rules:**
- Do NOT modify the report text in any way — only add citation markers
- Do NOT add whitespace
- Only cite where sources directly support a claim
- Avoid citing common knowledge or every sentence

**Citation guidelines:**
- Avoid citing unnecessarily — focus on key facts, conclusions, and claims readers would want to verify
- Cite complete thoughts, not individual words or small fragments
- Minimise sentence fragmentation — avoid multiple citations within a single sentence unless attributing specific claims to different sources
- No redundant citations: if multiple claims in the same sentence come from the same source, use one citation at the end

---

## Depth-first Planning Example

Query: "What causes obesity?"

Plan:
- Agent 1: Genetic and biological factors (research literature, meta-analyses)
- Agent 2: Environmental and socioeconomic influences (policy papers, epidemiology)
- Agent 3: Psychological and behavioural aspects (clinical psychology sources)
- Agent 4: Biomedical evidence and treatment approaches (medical journals)

Synthesis: Lead agent aggregates findings, resolves conflicts, writes report.

## Breadth-first Planning Example

Query: "Compare EU country tax systems"

Plan:
1. First, deploy one subagent to retrieve the current list of EU member states
2. Group countries geographically (Northern, Western, Eastern, Southern Europe)
3. Deploy 4 subagents in parallel — one per region — to research tax metrics for each country group
4. Lead agent synthesises into a comparative report

---

## Stopping Criteria

Stop research when:
- You have sufficient information to give a good answer
- Further research is returning diminishing results
- You have reached the tool call limit

Write the final report immediately. Do not deploy further subagents once a good answer is reachable.

---
name: extract-wisdom
description: Extract wisdom, insights, and actionable takeaways from YouTube videos, blog posts, articles, or text files. Use when asked to analyse, summarise, or extract key insights from a given content source. Downloads YouTube transcripts, fetches web articles, reads local files, performs analysis, and saves structured markdown.
---

# Wisdom Extraction

## Workflow

### Step 1: Identify Source and Acquire Content

**YouTube URL** (contains youtube.com or youtu.be):

Download transcript using yt-dlp:
```bash
yt-dlp --write-auto-sub --sub-lang en --skip-download \
  --restrict-filenames -o "%(upload_date)s-%(title)s/%(title)s.%(ext)s" \
  "<youtube-url>"
```

After downloading, rename the directory:
```bash
mv <OUTPUT_DIR> <OUTPUT_DIR>/../YYYY-MM-DD-<concise-description>
```

Keep the description short (1-6 words), use hyphens instead of spaces. Then read the transcript file.

**Web URL** (blog posts, articles, any non-YouTube URL):

Use WebFetch to extract content with prompt: "Extract the main article content"

**Local file path** (.txt, .md, or other text formats):

Use the Read tool to load content directly.

### Step 2: Analyse and Extract Wisdom

Keep the signal-to-noise ratio high. Preserve domain insights while excluding filler or fluff.

Extract:

#### 1. Key Insights & Takeaways
- Main ideas, core concepts, and central arguments
- Fundamental learnings and important revelations
- Expert advice, best practices, or recommendations
- Surprising or counterintuitive information

#### 2. Notable Quotes
- Memorable, impactful, or particularly well-articulated statements
- Include context for each quote when relevant
- Preserve the original wording exactly

#### 3. Structured Summary
- Hierarchical organisation of content
- Logical sections or themes
- Clear section headings that reflect content structure
- High-level overview followed by detailed breakdowns

#### 4. Actionable Takeaways
- Specific, concrete actions the audience can implement
- Clear, executable steps
- Immediate actions vs longer-term strategies
- Tools, resources, or techniques mentioned

### Step 3: Write Analysis to Markdown File

**YouTube sources:** The renamed directory from Step 1.

**Web and text sources:** `~/Downloads/text-wisdom/YYYY-MM-DD-<concise-description>/`

**File name:** `<source-title> - analysis.md`

Format:

```markdown
# Analysis: [Title]

**Source**: [YouTube URL, web URL, or file path]
**Analysis Date**: [YYYY-MM-DD]

## Summary
[Brief 2-3 sentence overview of the main topic and purpose]

### Simplified Explanation
[Explain the core concept in a way a non-expert could understand]

### Key Takeaways
- [Concise takeaway 1]
- [Concise takeaway 2]
- [Concise takeaway 3]

## Key Insights
- [Insight 1]
  - [Supporting detail]
- [Insight 2]

## Notable Quotes (Only include if there are notable quotes)
> "[Quote 1]"

Context: [Brief context if needed]

## Structured Breakdown
### [Section 1 Title]
[Content summary]

## Actionable Takeaways
1. [Specific action item 1]
2. [Specific action item 2]

## Additional Resources
[Any tools, links, or references mentioned in the content]

_Wisdom Extraction: [Current date in YYYY-MM-DD]_
```

After writing the analysis file, inform the user of the location.

### Step 4: Critical Self-Review

Create tasks to track:
- [ ] Proper English spelling throughout (no American English)
- [ ] No em-dashes, smart quotes, or non-standard typography
- [ ] Proper markdown formatting
- [ ] Accuracy and faithfulness to the original content
- [ ] Completeness
- [ ] Concise, clear content with no fluff or padding
- [ ] Logical organisation and structure

Re-read the analysis file, verify each item, fix any issues found.

## Additional Capabilities

### Multiple Source Analysis
- Process each source sequentially
- Each source gets its own directory
- Create comparative analysis highlighting common themes or contrasting viewpoints

### Topic-Specific Focus
- Search content for relevant keywords and themes
- Extract only content related to specified topics
- Provide concentrated analysis on areas of interest

## Tips

- Don't add new lines between items in a list
- Avoid marketing speak, fluff or unnecessary verbiage such as "comprehensive", "cutting-edge", "enterprise-grade"
- Do not use em-dashes or smart quotes
- Only use **bold** where emphasis is truly needed
- Always ask yourself if the sentence adds value — if not, remove it
- Consider creating mermaid diagrams to explain complex concepts, relationships, or workflows found in the content

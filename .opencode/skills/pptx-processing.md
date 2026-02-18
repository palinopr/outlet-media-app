# PPTX / Presentation Processing

Use when any .pptx file is involved -- creating slide decks, reading/parsing existing presentations, editing/modifying slides, working with templates, layouts, speaker notes, or comments.

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyse content | `python -m markitdown presentation.pptx` |
| Create from scratch | Use pptxgenjs (`npm install -g pptxgenjs`) |
| Edit existing | Unpack ZIP -> manipulate XML -> repack |
| Convert to images | LibreOffice -> PDF -> pdftoppm |

## Reading Content

```bash
python -m markitdown presentation.pptx
```

## Converting to Images

```bash
libreoffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
# Creates slide-01.jpg, slide-02.jpg, etc.
```

## Design Guidelines

### Before Starting

- **Pick a bold, content-informed colour palette**: The palette should feel designed for THIS topic
- **Dominance over equality**: One colour dominates (60-70%), with 1-2 supporting tones and one sharp accent
- **Dark/light contrast**: Dark backgrounds for title + conclusion slides, light for content
- **Commit to a visual motif**: Pick ONE distinctive element and repeat it

### Colour Palettes

| Theme | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Midnight Executive | `1E2761` (navy) | `CADCFC` (ice blue) | `FFFFFF` |
| Forest & Moss | `2C5F2D` (forest) | `97BC62` (moss) | `F5F5F5` |
| Coral Energy | `F96167` (coral) | `F9E795` (gold) | `2F3C7E` |
| Warm Terracotta | `B85042` (terracotta) | `E7E8D1` (sand) | `A7BEAE` |
| Ocean Gradient | `065A82` (deep blue) | `1C7293` (teal) | `21295C` |
| Charcoal Minimal | `36454F` (charcoal) | `F2F2F2` (off-white) | `212121` |
| Berry & Cream | `6D2E46` (berry) | `A26769` (dusty rose) | `ECE2D0` |
| Sage Calm | `84B59F` (sage) | `69A297` (eucalyptus) | `50808E` |
| Cherry Bold | `990011` (cherry) | `FCF6F5` (off-white) | `2F3C7E` |

### Per-Slide Design

**Every slide needs a visual element** -- image, chart, icon, or shape. Text-only slides are forgettable.

**Layout options:**
- Two-column (text left, illustration right)
- Icon + text rows
- 2x2 or 2x3 grid
- Half-bleed image with content overlay

**Data display:**
- Large stat callouts (60-72pt numbers with small labels)
- Comparison columns (before/after, pros/cons)
- Timeline or process flow

### Typography

| Header Font | Body Font |
|-------------|-----------|
| Georgia | Calibri |
| Arial Black | Arial |
| Cambria | Calibri |
| Trebuchet MS | Calibri |
| Palatino | Garamond |

| Element | Size |
|---------|------|
| Slide title | 36-44pt bold |
| Section header | 20-24pt bold |
| Body text | 14-16pt |
| Captions | 10-12pt muted |

### Spacing

- 0.5" minimum margins
- 0.3-0.5" between content blocks
- Leave breathing room

### Common Mistakes to Avoid

- Don't repeat the same layout across slides
- Don't centre body text -- left-align paragraphs and lists
- Don't skimp on size contrast (titles need 36pt+)
- Don't default to blue -- pick colours reflecting the topic
- Don't create text-only slides
- Don't forget text box padding when aligning shapes
- Don't use low-contrast elements
- NEVER use accent lines under titles (hallmark of AI-generated slides)

## QA (Required)

**Assume there are problems. Your job is to find them.**

### Content QA
```bash
python -m markitdown output.pptx
# Check for leftover placeholder text:
python -m markitdown output.pptx | grep -iE "xxxx|lorem|ipsum"
```

### Visual QA

Convert to images and inspect for:
- Overlapping elements
- Text overflow or cut off
- Elements too close (< 0.3" gaps)
- Uneven gaps
- Insufficient margin from slide edges (< 0.5")
- Misaligned columns
- Low-contrast text or icons
- Text boxes too narrow causing excessive wrapping
- Leftover placeholder content

### Verification Loop

1. Generate -> Convert to images -> Inspect
2. List issues found
3. Fix issues
4. Re-verify affected slides
5. Repeat until clean

## Dependencies

- `pip install "markitdown[pptx]"` -- text extraction
- `npm install -g pptxgenjs` -- creating from scratch
- LibreOffice -- PDF conversion
- Poppler (`pdftoppm`) -- PDF to images

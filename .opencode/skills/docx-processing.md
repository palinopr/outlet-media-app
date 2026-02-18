# DOCX Processing

Use when creating, reading, editing, or manipulating Word documents (.docx files). Includes creating new documents, modifying content, working with tracked changes, adding comments, inserting images, and converting formats.

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyse content | `pandoc` or unpack for raw XML |
| Create new document | Use `docx-js` (npm install -g docx) |
| Edit existing document | Unpack ZIP -> edit XML -> repack |

### Converting .doc to .docx

```bash
libreoffice --headless --convert-to docx document.doc
```

### Reading Content

```bash
# Text extraction with tracked changes
pandoc --track-changes=all document.docx -o output.md
```

## Creating New Documents

Generate .docx files with JavaScript. Install: `npm install -g docx`

### Setup
```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, ExternalHyperlink,
        TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
        VerticalAlign, PageNumber, PageBreak } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));
```

### Page Size

```javascript
// docx-js defaults to A4. Always set page size explicitly.
sections: [{
  properties: {
    page: {
      size: {
        width: 12240,   // 8.5 inches in DXA (US Letter)
        height: 15840   // 11 inches in DXA
      },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
    }
  },
  children: [/* content */]
}]
```

**Common page sizes (DXA units, 1440 DXA = 1 inch):**

| Paper | Width | Height | Content Width (1" margins) |
|-------|-------|--------|---------------------------|
| US Letter | 12,240 | 15,840 | 9,360 |
| A4 (default) | 11,906 | 16,838 | 9,026 |

**Landscape:** pass portrait dimensions and set `orientation: PageOrientation.LANDSCAPE` (docx-js swaps internally).

### Lists (NEVER use unicode bullets)

```javascript
// WRONG
new Paragraph({ children: [new TextRun("* Item")] })

// CORRECT - use numbering config with LevelFormat.BULLET
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "*", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Bullet item")] }),
    ]
  }]
});
```

### Tables

Set both `columnWidths` on the table AND `width` on each cell. Always use `WidthType.DXA` (percentages break in Google Docs). Use `ShadingType.CLEAR` not `SOLID` to prevent black backgrounds.

```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 4680, type: WidthType.DXA },
          shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun("Cell")] })]
        })
      ]
    })
  ]
})
```

### Images

```javascript
new Paragraph({
  children: [new ImageRun({
    type: "png", // Required: png, jpg, jpeg, gif, bmp, svg
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150 },
    altText: { title: "Title", description: "Desc", name: "Name" }
  })]
})
```

### Critical Rules for docx-js

- Set page size explicitly (defaults to A4)
- Landscape: pass portrait dimensions, set orientation
- Never use `\n` -- use separate Paragraph elements
- Never use unicode bullets -- use `LevelFormat.BULLET`
- PageBreak must be in a Paragraph
- ImageRun requires `type` parameter
- Always set table `width` with DXA, never `WidthType.PERCENTAGE`
- Tables need dual widths: `columnWidths` array AND cell `width`
- Table width = sum of columnWidths
- Always add cell margins for readable padding
- Use `ShadingType.CLEAR` for table shading
- TOC requires HeadingLevel only (no custom styles)
- Override built-in styles with exact IDs: "Heading1", "Heading2", etc.
- Include `outlineLevel` for TOC (0 for H1, 1 for H2, etc.)

## Editing Existing Documents

### Step 1: Unpack
```bash
# Unpack the docx (it's a ZIP of XML files)
mkdir unpacked && unzip document.docx -d unpacked/
```

### Step 2: Edit XML
Edit files in `unpacked/word/`. Use smart quotes for new content:

| Entity | Character |
|--------|-----------|
| `&#x2018;` | ' (left single) |
| `&#x2019;` | ' (right single / apostrophe) |
| `&#x201C;` | " (left double) |
| `&#x201D;` | " (right double) |

### Step 3: Repack
```bash
cd unpacked && zip -r ../output.docx . -x ".*"
```

### Tracked Changes XML

```xml
<!-- Insertion -->
<w:ins w:id="1" w:author="Author" w:date="2025-01-01T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>

<!-- Deletion (use w:delText inside w:del) -->
<w:del w:id="2" w:author="Author" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
```

## Dependencies

- **pandoc**: Text extraction
- **docx**: `npm install -g docx` (new documents)
- **LibreOffice**: PDF conversion
- **Poppler**: `pdftoppm` for images

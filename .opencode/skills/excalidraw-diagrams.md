---
name: excalidraw-diagrams
description: Use when asked to create or update Excalidraw diagrams. Provides guidance on Excalidraw best practices for generating .excalidraw files or inline previews.
---

# Creating Excalidraw Diagrams

When creating Excalidraw diagrams, ensure you:

- Generate the layout with correct spacing
- Make consistent and logical use of colours, fonts, and shapes
- Add text within shapes (not as separate floating text elements) unless desired
- Anchor/connect arrows and lines to shapes so connections remain intact when objects are moved
- Save the Excalidraw diagram content to a file and provide the file path

If the user has asked you to create Excalidraw diagrams but you do not have the Excalidraw MCP enabled, ask them to add it. It can be configured using the HTTP MCP URL: https://excalidraw-mcp-app.vercel.app/mcp

Excalidraw MCP documentation: https://github.com/excalidraw/excalidraw-mcp

## Choose Your Workflow

Pick one based on what the user needs.

### Inline preview only

Use when the diagram is for the conversation only — the user wants to see it in the chat and does not need a file.

- Use the MCP `create_view` tool with `label` on shapes
- No file output needed

### File output only (Python script)

Use when the user needs a `.excalidraw` file to open, share, edit, or keep.

- Generate the file with the Python script approach (see below)
- Provide the file path to the user
- Files can be opened by dragging into excalidraw.com, the Excalidraw desktop app, or VS Code with the Excalidraw extension

### Both (inline preview + file)

Use when the user wants to see the diagram in the chat AND keep a file. These are built independently — define the diagram structure conceptually, then render it twice.

## Critical: Text Does Not Survive Export

The `label` property on shapes is a convenience for inline preview only. It does NOT work in exported `.excalidraw` files — shapes render but text is invisible.

Native Excalidraw represents text inside shapes as two linked elements:
1. Shape: `"boundElements": [{"id": "text-id", "type": "text"}]`
2. Text: `"containerId": "shape-id"`, `"textAlign": "center"`, `"verticalAlign": "middle"`

The text element requires: `fontFamily` (1), `width`, `height`, `originalText`, `lineHeight` (1.25), `autoResize` (true).

All elements in .excalidraw files also need: `angle`, `seed`, `version`, `versionNonce`, `isDeleted`, `groupIds`, `frameId`, `updated`, `link`, `locked`.

Use a helper script rather than hand-writing this JSON.

## Python Script Approach for File Output

Generate native .excalidraw files by writing a Python script that produces correct JSON. The key functions to implement or reference:

| Function | Purpose |
|----------|---------|
| `labeled_rect(id, x, y, w, h, bg, stroke, label)` | Shape with centred bound text |
| `rect(id, x, y, w, h, bg, stroke)` | Rectangle without text |
| `txt(id, x, y, w, h, text, size)` | Standalone or bound text |
| `bound_arrow(id, elements, start_id, start_point, end_id, end_point)` | Arrow anchored to two shapes |
| `write_scene(elements, path)` | Wraps in scene structure and saves |

Example structure:
```python
import sys, random
random.seed(42)
elements = []
# title
elements.append(txt("t1", 200, 10, 300, 30, "My Diagram", 24))
# boxes
elements.extend(labeled_rect("a", 50, 60, 200, 70, "#a5d8ff", "#4a9eed", "Step One"))
elements.extend(labeled_rect("b", 350, 60, 200, 70, "#b2f2bb", "#22c55e", "Step Two"))
# arrow
elements.append(bound_arrow("a1", elements, "a", [1, 0.5], "b", [0, 0.5]))
write_scene(elements, "/path/to/output.excalidraw")
```

## Arrow Anchoring

Use `bound_arrow` instead of plain `arrow` to anchor arrows to shapes. It handles bidirectional binding automatically.

`fixedPoint` values for connection points: top=`[0.5, 0]`, right=`[1, 0.5]`, bottom=`[0.5, 1]`, left=`[0, 0.5]`

**Important rules:**
- Shapes must exist in `elements` before calling `bound_arrow` (it mutates their `boundElements`)
- **Minimum 60px gap between connected shapes** — arrows overlap and pass through boxes if shapes are too close
- Avoid large background rectangles that overlap connectable shapes — binding resolution can misfire

## Privacy

If the diagram contains potentially sensitive information (network diagrams, identifiable information, etc.) and the user asks to upload to excalidraw.com, warn them first: this makes the diagram publicly accessible.

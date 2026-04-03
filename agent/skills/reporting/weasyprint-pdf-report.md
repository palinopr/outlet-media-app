> Auto-created by Reporting on 2026-03-16

# Generate Styled PDF Reports with WeasyPrint

Multi-step procedure for generating professional PDF reports with horizontal bar charts that render correctly in WeasyPrint.

## Key Insight
WeasyPrint does NOT render CSS-only bar charts (e.g., using `width` percentage on divs). Use **table-based horizontal bars** with inline background styling instead.

## Steps

### 1. Build HTML Template with Inline CSS
- Use `page-break-after: always` for clean page separation
- Embed all styles inline (WeasyPrint doesn't load external CSS reliably)
- Use gradient backgrounds for hero/cover pages

### 2. Horizontal Bar Charts (WeasyPrint-Compatible)
Instead of CSS percentage-width divs, use table rows with colored backgrounds:

```html
<table style="width:100%; border-collapse:collapse;">
  <tr>
    <td style="width:120px; padding:6px;">Label</td>
    <td style="padding:6px;">
      <div style="background:#4f46e5; height:20px; width:75%; border-radius:4px;"></div>
    </td>
    <td style="width:60px; text-align:right; padding:6px;">75%</td>
  </tr>
</table>
```

### 3. Page Layout Strategy
- Estimate content height per page (~950px usable at A4)
- If content overflows, split into separate pages with `page-break-before: always`
- Test render after each change — WeasyPrint pagination differs from browser

### 4. Generate PDF
```python
import weasyprint
html_string = open("report.html").read()
weasyprint.HTML(string=html_string).write_pdf("report.pdf")
```

Or via CLI:
```bash
weasyprint report.html report.pdf
```

### 5. Send via Email (Gmail API)
- Attach PDF as base64-encoded MIME part
- Use multipart/mixed message with HTML body + PDF attachment

## Common Pitfalls
- **Empty charts**: CSS `width: X%` on divs may not render → use table approach
- **Overflow**: Content spilling to next page → add explicit page breaks
- **Fonts**: Embed or use system fonts only (Google Fonts won't load)
- **Images**: Use base64 data URIs, not external URLs
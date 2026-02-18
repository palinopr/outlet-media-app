# Web Artifacts Builder

Tools for creating elaborate, multi-component web applications using modern frontend technologies (React, Tailwind CSS, shadcn/ui). Use for complex web apps requiring state management, routing, or component libraries.

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui

## Design Guidelines

Avoid "AI slop": excessive centred layouts, purple gradients, uniform rounded corners, and Inter font. Be distinctive.

## Quick Start

### Step 1: Initialise Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### Step 2: Add Tailwind CSS

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Configure in `vite.config.ts`:
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 3: Add shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog input
# Add whatever components you need
```

### Step 4: Develop

Edit the generated files. Key locations:
- `src/App.tsx` -- main application
- `src/components/` -- your components
- `src/components/ui/` -- shadcn/ui components

### Step 5: Build

```bash
npm run build
# Output in dist/
```

### Step 6: Bundle to Single HTML (Optional)

For self-contained single-file distribution:

```bash
npm install -D parcel html-inline
npx parcel build index.html --no-source-maps
npx html-inline dist/index.html -o bundle.html
```

## Component Reference

shadcn/ui documentation: https://ui.shadcn.com/docs/components

Key components:
- Layout: Card, Separator, Tabs
- Forms: Button, Input, Select, Checkbox, Switch
- Feedback: Alert, Dialog, Toast
- Navigation: Dropdown Menu, Navigation Menu
- Data: Table, Badge

## Testing

Use Playwright for visual/functional testing:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='screenshot.png', full_page=True)
    browser.close()
```

Or use the Playwright MCP tools if available.

# Web Application Testing

Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behaviour, capturing browser screenshots, and viewing browser logs.

## Decision Tree

```
User task -> Is it static HTML?
    Yes -> Read HTML file directly to identify selectors
           -> Write Playwright script using selectors
    No (dynamic webapp) -> Is the server already running?
        No -> Start server first, then run Playwright
        Yes -> Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Core Pattern: Playwright Script

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')  # CRITICAL: Wait for JS to execute

    # Your automation logic here

    browser.close()
```

## Starting Server + Running Tests

**Single server:**
```bash
# Start server in background, run test, then kill
npm run dev &
SERVER_PID=$!
sleep 3
python your_automation.py
kill $SERVER_PID
```

**Multiple servers (backend + frontend):**
```bash
(cd backend && python server.py) &
PID1=$!
(cd frontend && npm run dev) &
PID2=$!
sleep 5
python your_automation.py
kill $PID1 $PID2
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM:**
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
   content = page.content()
   page.locator('button').all()
   ```

2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

Do NOT inspect the DOM before waiting for `networkidle` on dynamic apps. Always wait for `page.wait_for_load_state('networkidle')` before inspection.

## Best Practices

- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`
- For static HTML files, use `file://` URLs: `page.goto(f'file://{os.path.abspath("index.html")}')`

## Playwright MCP Integration

If a Playwright MCP server is available (as configured in opencode.json), use MCP tools directly:
- `browser_navigate` to load pages
- `browser_snapshot` for accessibility tree inspection
- `browser_take_screenshot` for visual inspection
- `browser_click`, `browser_type` for interactions
- `browser_console_messages` for debugging

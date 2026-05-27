# Outlet Meet Memory Capture

Local Google Meet caption capture for Outlet Media Memory.

This tool is for meetings where Google Workspace recording/transcripts are not available to Jaime. It does not record audio and it does not bypass Google Meet admin controls. It captures the live captions already visible in the Meet tab, then sends a structured meeting record to a local writer.

## Pieces

- `extension/` - unpacked Chrome extension for `meet.google.com`
- `writer/server.mjs` - local HTTP writer that receives captures from the extension
- `writer/server.node-test.mjs` - writer unit tests

## What Gets Written

The writer creates two outputs:

1. A full raw transcript artifact outside the Obsidian vault:

   ```text
   ~/Documents/Outlet Meet Captures/
   ```

2. A clean Raw Inbox source note in Outlet Media Memory:

   ```text
   /Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory/50 Sources/Raw Inbox/
   ```

The Raw Inbox note includes meeting metadata, consent status, links to local transcript artifacts, and any reviewed summary/decisions/actions/follow-up text entered in the extension. It intentionally does not include the full raw transcript by default.

## Start The Writer

From this repo:

```bash
node tools/meet-memory-capture/writer/server.mjs
```

Optional environment variables:

```bash
PORT=7766
OUTLET_MEMORY_VAULT="/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory"
OUTLET_MEET_CAPTURE_DIR="$HOME/Documents/Outlet Meet Captures"
OUTLET_MEET_CAPTURE_ALLOWED_ORIGINS="chrome-extension://<installed-extension-id>"
```

If `OUTLET_MEET_CAPTURE_ALLOWED_ORIGINS` is not set, the writer accepts browser
requests only from Chrome extension origins and rejects normal webpage origins.

Health check:

```bash
curl http://127.0.0.1:7766/health
```

Targeted writer test:

```bash
node --test tools/meet-memory-capture/writer/server.node-test.mjs
```

## Load The Extension

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select:

   ```text
   /Users/jaimeortiz/outlet-media-app/tools/meet-memory-capture/extension
   ```

## Use In A Meeting

1. Join Google Meet.
2. Tell participants you are capturing captions for notes.
3. Click the extension icon.
4. Check `Participants were notified`.
5. Click `Start Capture`.
6. Turn on Meet captions if the extension cannot do it automatically.
7. During or after the call, add reviewed summary/decisions/actions/follow-up text.
8. Click `Send To Outlet Memory`.

## Limits

- Captions must be enabled in Meet.
- Capture only works while the Meet tab is open and the extension is running.
- Speaker names and text are only as accurate as Google Meet captions.
- Google can change Meet DOM structure; `extension/content.js` contains selector fallbacks and diagnostics.
- This is consent-based note capture, not hidden recording.

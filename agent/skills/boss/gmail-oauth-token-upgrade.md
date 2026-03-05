> Auto-created by Boss on 2026-03-05

# Gmail OAuth Token Upgrade (modify permissions)

## When to Use
When you need to upgrade a Gmail OAuth2 token to include `modify`, `labels`, `readonly`, or `drive.readonly` scopes — e.g., to programmatically label, archive, or clean an inbox.

## Prerequisites
- Google Cloud Console project with OAuth2 credentials (Client ID + Secret)
- `http://localhost:9876` added as an **Authorized redirect URI** in Cloud Console
- Node.js available on the machine

## Steps

### 1. Add redirect URI in Google Cloud Console
- Go to **APIs & Services → Credentials → OAuth 2.0 Client IDs**
- Edit the relevant client and add `http://localhost:9876` to **Authorized redirect URIs**

### 2. Create the OAuth capture script

```javascript
// oauth-upgrade.mjs
import http from "http";
import open from "open";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:9876";
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=${encodeURIComponent(SCOPES)}&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  if (!code) { res.end("No code"); return; }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI, grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  console.log("=== NEW TOKENS ===");
  console.log(JSON.stringify(tokens, null, 2));

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>Success!</h1><p>You can close this tab.</p>");
  server.close();
});

server.listen(9876, () => {
  console.log("Listening on http://localhost:9876 …");
  open(authUrl);
});
```

### 3. Run the script
```bash
node oauth-upgrade.mjs
```

### 4. Authorize in browser
- Sign in with the target Google account
- Approve all requested scopes
- Browser redirects to localhost:9876 → script captures the authorization code

### 5. Update `.env` with new tokens
Copy `access_token` and `refresh_token` from the script output into your `.env` / `.env.local`:
```
GOOGLE_REFRESH_TOKEN=<new_refresh_token>
GOOGLE_ACCESS_TOKEN=<new_access_token>
```

## Notes
- Use `prompt=consent` to force re-consent and get a new `refresh_token`
- Use `access_type=offline` to receive a `refresh_token`
- The refresh token is long-lived; the access token expires in ~1 hour
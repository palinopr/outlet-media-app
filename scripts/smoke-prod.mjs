const DEFAULT_BASE_URL = "https://outlet-media-app-production.up.railway.app";
const baseUrl = (process.env.PROD_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");

const checks = [
  {
    method: "GET",
    name: "health",
    path: "/api/health",
    status: 200,
    validate: async (response) => {
      const body = await response.json();
      if (body.status !== "ok") {
        throw new Error(`expected status ok, received ${body.status}`);
      }
      if (body.checks?.database !== "ok") {
        throw new Error(`expected database ok, received ${body.checks?.database}`);
      }
    },
  },
  { method: "GET", name: "privacy", path: "/privacy", status: 200 },
  { method: "GET", name: "deletion status", path: "/deletion-status/test-code", status: 200 },
  { method: "GET", name: "9am orlando", path: "/9am/orlando", status: 200 },
  {
    body: "signed_request=invalid.data",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    name: "meta deletion rejects invalid signature",
    path: "/api/meta/data-deletion",
    status: 403,
  },
  {
    body: "{}",
    headers: { "Content-Type": "application/json" },
    method: "POST",
    name: "contact rejects invalid payload",
    path: "/api/contact",
    status: 400,
  },
];

let failures = 0;

for (const check of checks) {
  try {
    const response = await fetch(`${baseUrl}${check.path}`, {
      body: check.body,
      headers: check.headers,
      method: check.method,
    });

    if (response.status !== check.status) {
      throw new Error(`expected ${check.status}, received ${response.status}`);
    }

    if (check.validate) {
      await check.validate(response);
    }

    console.log(`PASS ${check.name}`);
  } catch (error) {
    failures += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FAIL ${check.name}: ${message}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}

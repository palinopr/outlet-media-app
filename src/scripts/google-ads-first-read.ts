import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

loadLocalEnv();

const customerIdArg = getCliValue("customer") ?? getPositionalCustomerId();
const loginCustomerIdArg = getCliValue("login");
const { fetchGoogleAdsFirstReadSnapshot } = await import(
  new URL("../lib/google-ads.ts", import.meta.url).href,
);

try {
  const snapshot = await fetchGoogleAdsFirstReadSnapshot({
    customerId: customerIdArg ?? undefined,
    loginCustomerId: loginCustomerIdArg ?? undefined,
  });

  console.log(JSON.stringify(snapshot, null, 2));
} catch (error) {
  console.error("[google:first-read] failed");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
}

function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim();
      if (!key || process.env[key]) continue;

      let value = line.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

function getCliValue(name: string): string | null {
  const prefix = `--${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return null;
}

function getPositionalCustomerId(): string | null {
  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith("--")) return arg;
  }
  return null;
}

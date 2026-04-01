import {
  prepareConciergeSelection,
  runPreparedConciergeCheckout,
} from "../../src/features/whatsapp-ticket-concierge/runner";

function readArg(flag: string): string | null {
  const args = process.argv.slice(2);
  const direct = args.find((arg) => arg.startsWith(`${flag}=`));
  if (direct) {
    return direct.slice(flag.length + 1);
  }

  const index = args.findIndex((arg) => arg === flag);
  if (index >= 0) {
    return args[index + 1] ?? null;
  }

  return null;
}

async function main() {
  const body =
    readArg("--body") ??
    "[zamora-miami] I need 2 tickets for Zamora under $300";
  const pick = readArg("--pick");

  const prepared = await prepareConciergeSelection({
    body,
    conversationMetadata: {},
  });

  if (prepared.status !== "options_ready" || !pick) {
    process.stdout.write(`${JSON.stringify(prepared, null, 2)}\n`);
    return;
  }

  const ordinal = Number.parseInt(pick, 10);
  const selected = prepared.options.find((option) => option.ordinal === ordinal);
  if (!selected) {
    process.stderr.write(`No prepared option matched ordinal ${pick}.\n`);
    process.exit(1);
  }

  const checkout = await runPreparedConciergeCheckout({
    option: selected,
  });

  process.stdout.write(
    `${JSON.stringify({ prepared, checkout }, null, 2)}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.stack ?? error.message : String(error)}\n`,
  );
  process.exit(1);
});

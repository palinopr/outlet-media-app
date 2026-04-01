import { prepareConciergeSelection } from "../../src/features/whatsapp-ticket-concierge/runner";

async function main() {
  const body =
    process.argv.slice(2).join(" ").trim() ||
    "[zamora-miami] I need 2 tickets for Zamora under $300";

  const result = await prepareConciergeSelection({
    body,
    conversationMetadata: {},
  });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.stack ?? error.message : String(error)}\n`,
  );
  process.exit(1);
});

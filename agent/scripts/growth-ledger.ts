import "dotenv/config";
import {
  createGrowthContentJob,
  createGrowthInboundEvent,
  createGrowthIdea,
  createGrowthLead,
  createGrowthPlaybook,
  createGrowthPublishAttempt,
  createGrowthPostTarget,
  listGrowthAccounts,
  listGrowthInboundEvents,
  listGrowthIdeas,
  listGrowthJobs,
  listGrowthLanes,
  listGrowthLeads,
  listGrowthPlaybooks,
  listGrowthPublishAttempts,
  listGrowthTargets,
  updateGrowthLead,
  updateGrowthPublishAttempt,
  upsertGrowthAccount,
  upsertGrowthLane,
} from "../src/services/growth-ledger-service.js";

function usage() {
  return `
Usage:
  node --import tsx/esm scripts/growth-ledger.ts <command> [options]

Commands:
  list-accounts       [--platform <platform>] [--status <status>] [--limit <n>]
  list-lanes          [--status <status>] [--limit <n>]
  list-ideas          [--lane <lane-ref>] [--status <status>] [--limit <n>]
  list-jobs           [--lane <lane-ref>] [--account <account-ref>] [--status <status>] [--limit <n>]
  list-targets        [--job <job-ref>] [--account <account-ref>] [--status <status>] [--limit <n>]
  list-inbound        [--account <account-ref>] [--platform <platform>] [--status <status>] [--limit <n>]
  list-leads          [--lane <lane-ref>] [--account <account-ref>] [--status <status>] [--limit <n>]
  list-publish        [--target <target-ref>] [--status <status>] [--limit <n>]
  list-playbooks      [--pod <pod>] [--status <status>] [--limit <n>]
  upsert-account      --platform <platform> --label <label> [--handle <handle>] [--mode <mode>] [--status <status>] [--owner-kind <kind>] [--channel <name>] [--profile-url <url>] [--metadata <json>]
  upsert-lane         --slug <slug> --name <name> [--description <text>] [--offer <text>] [--audience <text>] [--status <status>] [--metadata <json>]
  create-idea         --title <title> [--lane <lane-ref>] [--account <account-ref>] [--source-type <type>] [--status <status>] [--notes <text>] [--tags a,b] [--metadata <json>]
  create-job          --title <title> [--lane <lane-ref>] [--account <account-ref>] [--idea <idea-ref>] [--status <status>] [--mode <mode>] [--brief <text>] [--script <text>] [--cta <text>] [--schedule <iso>] [--metadata <json>]
  create-target       --job <job-ref> --platform <platform> [--account <account-ref>] [--status <status>] [--variant <label>] [--metadata <json>]
  create-inbound      --platform <platform> --source-type <type> --body <text> [--account <account-ref>] [--job <job-ref>] [--target <target-ref>] [--sender-handle <handle>] [--sender-name <name>] [--status <status>] [--event-at <iso>] [--metadata <json>]
  create-lead         [--account <account-ref>] [--lane <lane-ref>] [--inbound <inbound-ref>] [--platform <platform>] [--name <contact>] [--company <company>] [--email <email>] [--phone <phone>] [--status <status>] [--score <0-100>] [--summary <text>] [--next-action <text>] [--owner <name>] [--metadata <json>]
  update-lead         --lead <lead-ref> [--status <status>] [--score <0-100>] [--summary <text>] [--next-action <text>] [--owner <name>] [--metadata <json>]
  create-publish      --target <target-ref> [--platform <platform>] [--status <status>] [--requested-by <agent>] [--note <text>] [--manual <text>] [--approved-by <name>] [--metadata <json>]
  update-publish      --attempt <attempt-ref> --status <status> [--approved-by <name>] [--note <text>] [--manual <text>] [--publish-url <url>] [--platform-post-id <id>] [--error-message <text>] [--metadata <json>]
  save-playbook       --pod <pod> --title <title> --summary <summary> --body <markdown> [--platform <platform>] [--status <status>] [--metadata <json>]
`;
}

function option(args: string[], name: string): string | undefined {
  const flag = `--${name}`;
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function requiredOption(args: string[], name: string) {
  const value = option(args, name);
  if (!value) {
    throw new Error(`Missing required option --${name}`);
  }
  return value;
}

function optionJson(args: string[], name: string): Record<string, unknown> | undefined {
  const raw = option(args, name);
  if (!raw) return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("must be a JSON object");
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON for --${name}: ${message}`);
  }
}

function optionList(args: string[], name: string): string[] | undefined {
  const raw = option(args, name);
  if (!raw) return undefined;
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function optionNumber(args: string[], name: string): number | undefined {
  const raw = option(args, name);
  if (!raw) return undefined;

  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0) {
    throw new Error(`Invalid number for --${name}: ${raw}`);
  }
  return value;
}

function optionScore(args: string[], name: string): number | undefined {
  const raw = option(args, name);
  if (!raw) return undefined;

  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid score for --${name}: ${raw}`);
  }
  if (value < 0 || value > 100) {
    throw new Error(`Invalid score for --${name}: ${value}`);
  }
  return value;
}

function print(value: unknown) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help" || command === "--help") {
    process.stdout.write(usage());
    return;
  }

  switch (command) {
    case "list-accounts":
      print(await listGrowthAccounts({
        limit: optionNumber(args, "limit"),
        platform: option(args, "platform") as never,
        status: option(args, "status") as never,
      }));
      return;

    case "list-lanes":
      print(await listGrowthLanes({
        limit: optionNumber(args, "limit"),
        status: option(args, "status") as never,
      }));
      return;

    case "list-ideas":
      print(await listGrowthIdeas({
        laneRef: option(args, "lane"),
        limit: optionNumber(args, "limit"),
        status: option(args, "status") as never,
      }));
      return;

    case "list-jobs":
      print(await listGrowthJobs({
        accountRef: option(args, "account"),
        laneRef: option(args, "lane"),
        limit: optionNumber(args, "limit"),
        status: option(args, "status") as never,
      }));
      return;

    case "list-targets":
      print(await listGrowthTargets({
        accountRef: option(args, "account"),
        contentJobRef: option(args, "job"),
        limit: optionNumber(args, "limit"),
        status: option(args, "status") as never,
      }));
      return;

    case "list-inbound":
      print(await listGrowthInboundEvents({
        accountRef: option(args, "account"),
        limit: optionNumber(args, "limit"),
        platform: option(args, "platform") as never,
        status: option(args, "status") as never,
      }));
      return;

    case "list-leads":
      print(await listGrowthLeads({
        accountRef: option(args, "account"),
        laneRef: option(args, "lane"),
        limit: optionNumber(args, "limit"),
        status: option(args, "status") as never,
      }));
      return;

    case "list-playbooks":
      print(await listGrowthPlaybooks({
        limit: optionNumber(args, "limit"),
        pod: option(args, "pod") as never,
        status: option(args, "status") as never,
      }));
      return;

    case "list-publish":
      print(await listGrowthPublishAttempts({
        limit: optionNumber(args, "limit"),
        postTargetRef: option(args, "target"),
        status: option(args, "status") as never,
      }));
      return;

    case "upsert-account":
      print(await upsertGrowthAccount({
        actorName: option(args, "actor-name"),
        handle: option(args, "handle"),
        label: requiredOption(args, "label"),
        metadata: optionJson(args, "metadata"),
        operatingMode: option(args, "mode") as never,
        ownerKind: option(args, "owner-kind") as never,
        platform: requiredOption(args, "platform") as never,
        primaryChannelName: option(args, "channel"),
        profileUrl: option(args, "profile-url"),
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
      }));
      return;

    case "upsert-lane":
      print(await upsertGrowthLane({
        actorName: option(args, "actor-name"),
        audienceSummary: option(args, "audience"),
        description: option(args, "description"),
        metadata: optionJson(args, "metadata"),
        name: requiredOption(args, "name"),
        primaryOffer: option(args, "offer"),
        slug: requiredOption(args, "slug"),
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
      }));
      return;

    case "create-idea":
      print(await createGrowthIdea({
        accountRef: option(args, "account"),
        actorName: option(args, "actor-name"),
        laneRef: option(args, "lane"),
        metadata: optionJson(args, "metadata"),
        notes: option(args, "notes"),
        source: option(args, "source") ?? "cli",
        sourceType: option(args, "source-type") as never,
        status: option(args, "status") as never,
        tags: optionList(args, "tags"),
        title: requiredOption(args, "title"),
      }));
      return;

    case "create-job":
      print(await createGrowthContentJob({
        accountRef: option(args, "account"),
        actorName: option(args, "actor-name"),
        approvedBy: option(args, "approved-by"),
        brief: option(args, "brief"),
        callToAction: option(args, "cta"),
        ideaRef: option(args, "idea"),
        laneRef: option(args, "lane"),
        metadata: optionJson(args, "metadata"),
        operatingMode: option(args, "mode") as never,
        scheduledFor: option(args, "schedule"),
        script: option(args, "script"),
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
        title: requiredOption(args, "title"),
      }));
      return;

    case "create-target":
      print(await createGrowthPostTarget({
        accountRef: option(args, "account"),
        actorName: option(args, "actor-name"),
        contentJobRef: requiredOption(args, "job"),
        metadata: optionJson(args, "metadata"),
        platform: requiredOption(args, "platform") as never,
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
        variantLabel: option(args, "variant"),
      }));
      return;

    case "create-inbound":
      print(await createGrowthInboundEvent({
        accountRef: option(args, "account"),
        actorName: option(args, "actor-name"),
        bodyText: requiredOption(args, "body"),
        contentJobRef: option(args, "job"),
        eventAt: option(args, "event-at"),
        metadata: optionJson(args, "metadata"),
        platform: requiredOption(args, "platform") as never,
        postTargetRef: option(args, "target"),
        senderDisplayName: option(args, "sender-name"),
        senderHandle: option(args, "sender-handle"),
        source: option(args, "source") ?? "cli",
        sourceType: requiredOption(args, "source-type") as never,
        status: option(args, "status") as never,
      }));
      return;

    case "create-lead":
      print(await createGrowthLead({
        accountRef: option(args, "account"),
        actorName: option(args, "actor-name"),
        companyName: option(args, "company"),
        contactName: option(args, "name"),
        email: option(args, "email"),
        inboundEventRef: option(args, "inbound"),
        laneRef: option(args, "lane"),
        metadata: optionJson(args, "metadata"),
        nextAction: option(args, "next-action"),
        ownerName: option(args, "owner"),
        phone: option(args, "phone"),
        platform: option(args, "platform") as never,
        score: optionScore(args, "score"),
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
        summary: option(args, "summary"),
      }));
      return;

    case "update-lead":
      print(await updateGrowthLead({
        actorName: option(args, "actor-name"),
        leadRef: requiredOption(args, "lead"),
        metadata: optionJson(args, "metadata"),
        nextAction: option(args, "next-action"),
        ownerName: option(args, "owner"),
        score: optionScore(args, "score"),
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
        summary: option(args, "summary"),
      }));
      return;

    case "create-publish":
      print(await createGrowthPublishAttempt({
        actorName: option(args, "actor-name"),
        approvedBy: option(args, "approved-by"),
        manualInstructions: option(args, "manual"),
        metadata: optionJson(args, "metadata"),
        note: option(args, "note"),
        platform: option(args, "platform") as never,
        postTargetRef: requiredOption(args, "target"),
        requestedByAgent: option(args, "requested-by") as never,
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
      }));
      return;

    case "update-publish":
      print(await updateGrowthPublishAttempt({
        actorName: option(args, "actor-name"),
        approvedBy: option(args, "approved-by"),
        attemptRef: requiredOption(args, "attempt"),
        errorMessage: option(args, "error-message"),
        manualInstructions: option(args, "manual"),
        metadata: optionJson(args, "metadata"),
        note: option(args, "note"),
        platformPostId: option(args, "platform-post-id"),
        publishUrl: option(args, "publish-url"),
        source: option(args, "source") ?? "cli",
        status: requiredOption(args, "status") as never,
      }));
      return;

    case "save-playbook":
      print(await createGrowthPlaybook({
        actorName: option(args, "actor-name"),
        bodyMarkdown: requiredOption(args, "body"),
        metadata: optionJson(args, "metadata"),
        platform: option(args, "platform") as never,
        pod: requiredOption(args, "pod") as never,
        source: option(args, "source") ?? "cli",
        status: option(args, "status") as never,
        summary: requiredOption(args, "summary"),
        title: requiredOption(args, "title"),
      }));
      return;

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});

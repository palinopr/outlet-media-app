/**
 * discord-buttons.ts -- Interactive button components.
 *
 * Adds buttons to embeds for quick actions:
 * - Dashboard: refresh, run meta sync
 * - Schedule: enable-all, disable-all
 * - Supervisor: run supervision
 *
 * Button interactions are handled in the interactionCreate event.
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ButtonInteraction,
  type Client,
} from "discord.js";

// --- Button Row Builders --------------------------------------------------

export function dashboardButtons(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_dashboard_refresh")
      .setLabel("Refresh Dashboard")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🔄"),
    new ButtonBuilder()
      .setCustomId("btn_meta_sync")
      .setLabel("Run Meta Sync")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("📊"),
  );
}

export function scheduleButtons(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_enable_all")
      .setLabel("Enable All")
      .setStyle(ButtonStyle.Success)
      .setEmoji("▶️"),
    new ButtonBuilder()
      .setCustomId("btn_disable_all")
      .setLabel("Disable All")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("⏸️"),
    new ButtonBuilder()
      .setCustomId("btn_schedule_list")
      .setLabel("Show Status")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("📋"),
  );
}

export function superviseButton(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_supervise")
      .setLabel("Run Supervision")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("👀"),
  );
}

// --- Interaction Handler --------------------------------------------------

/**
 * Register the button interaction handler on the Discord client.
 * Call this once during bot startup.
 */
export function registerButtonHandler(client: Client): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const btn = interaction as ButtonInteraction;
    const customId = btn.customId;

    try {
      switch (customId) {
        case "btn_dashboard_refresh": {
          await btn.deferReply({ ephemeral: true });
          const { updateDashboard } = await import("./discord-dashboard.js");
          const result = await updateDashboard(client);
          await btn.editReply(result);
          break;
        }

        case "btn_meta_sync": {
          await btn.deferReply({ ephemeral: true });
          const { triggerManualJob } = await import("./scheduler.js");
          triggerManualJob("meta-sync");
          await btn.editReply("Meta sync triggered. Results will appear in #media-buyer and #dashboard.");
          break;
        }

        case "btn_enable_all": {
          await btn.deferReply({ ephemeral: true });
          const { handleScheduleCommand } = await import("./discord-schedule.js");
          const result = await handleScheduleCommand("!enable-all", client, "schedule");
          await btn.editReply(result?.text || "All jobs enabled.");
          break;
        }

        case "btn_disable_all": {
          await btn.deferReply({ ephemeral: true });
          const { handleScheduleCommand } = await import("./discord-schedule.js");
          const result = await handleScheduleCommand("!disable-all", client, "schedule");
          await btn.editReply(result?.text || "All jobs disabled.");
          break;
        }

        case "btn_schedule_list": {
          await btn.deferReply({ ephemeral: true });
          const { handleScheduleCommand } = await import("./discord-schedule.js");
          const result = await handleScheduleCommand("!schedule list", client, "schedule");
          if (result?.embed) {
            await btn.editReply({ embeds: [result.embed] });
          } else {
            await btn.editReply("No schedule data available.");
          }
          break;
        }

        case "btn_supervise": {
          await btn.deferReply({ ephemeral: true });
          const { handleSuperviseCommand } = await import("./discord-supervisor.js");
          const result = await handleSuperviseCommand(client);
          await btn.editReply({ embeds: [result.embed] });
          break;
        }

        default:
          await btn.reply({ content: "Unknown button.", ephemeral: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (btn.deferred || btn.replied) {
        await btn.editReply(`Error: ${msg}`).catch(() => {});
      } else {
        await btn.reply({ content: `Error: ${msg}`, ephemeral: true }).catch(() => {});
      }
    }
  });
}

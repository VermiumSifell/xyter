// Dependencies
import { CommandInteraction, Permissions } from "discord.js";

// Configurations
import getEmbedConfig from "@helpers/getEmbedConfig";

//Handlers
import logger from "@logger";

// Models
import guildSchema from "@schemas/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("credits")
      .setDescription(`Credits`)
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should credits be enabled?")
      )
      .addNumberOption((option) =>
        option.setName("rate").setDescription("Amount of credits per message.")
      )
      .addNumberOption((option) =>
        option
          .setName("minimum-length")
          .setDescription("Minimum length of message to earn credits.")
      )
      .addNumberOption((option) =>
        option
          .setName("work-rate")
          .setDescription("Maximum amount of credits on work.")
      )
      .addNumberOption((option) =>
        option
          .setName("work-timeout")
          .setDescription("Timeout between work schedules (seconds).")
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (seconds).")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    if (interaction.guild == null) return;
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild); // Destructure member
    const { guild, options } = interaction;

    if (guild == null) return;

    // Get options
    const status = options?.getBoolean("status");
    const rate = options?.getNumber("rate");
    const timeout = options?.getNumber("timeout");
    const minimumLength = options?.getNumber("minimum-length");
    const workRate = options?.getNumber("work-rate");
    const workTimeout = options?.getNumber("work-timeout");

    // Get guild object
    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild is null`);
    }

    // Modify values
    guildDB.credits.status =
      status !== null ? status : guildDB?.credits?.status;
    guildDB.credits.rate = rate !== null ? rate : guildDB?.credits?.rate;
    guildDB.credits.timeout =
      timeout !== null ? timeout : guildDB?.credits?.timeout;
    guildDB.credits.workRate =
      workRate !== null ? workRate : guildDB?.credits?.workRate;
    guildDB.credits.workTimeout =
      workTimeout !== null ? workTimeout : guildDB?.credits?.workTimeout;
    guildDB.credits.minimumLength =
      minimumLength !== null ? minimumLength : guildDB?.credits?.minimumLength;

    // Save guild
    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild saved`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":tools: Settings - Guild [Credits]",
            description: `Credits settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Status",
                value: `${guildDB?.credits?.status}`,
                inline: true,
              },
              {
                name: "📈 Rate",
                value: `${guildDB?.credits?.rate}`,
                inline: true,
              },
              {
                name: "📈 Work Rate",
                value: `${guildDB?.credits?.workRate}`,
                inline: true,
              },
              {
                name: "🔨 Minimum Length",
                value: `${guildDB?.credits?.minimumLength}`,
                inline: true,
              },
              {
                name: "⏰ Timeout",
                value: `${guildDB?.credits?.timeout}`,
                inline: true,
              },
              {
                name: "⏰ Work Timeout",
                value: `${guildDB?.credits?.workTimeout}`,
                inline: true,
              },
            ],
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });
  },
};

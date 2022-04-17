// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import guildSchema from "@schemas/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("audits")
      .setDescription("Audits")
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should audits be enabled?")
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel for audit messages.")
          .addChannelType(ChannelType.GuildText as number)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { options, guild } = interaction;

    // Get options
    const status = options?.getBoolean("status");
    const channel = options?.getChannel("channel");

    // Get guild object
    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.verbose(`Guild not found in database.`);
    }

    // Modify values
    guildDB.audits.status = status !== null ? status : guildDB?.audits?.status;
    guildDB.audits.channelId =
      channel !== null ? channel.id : guildDB?.audits?.channelId;

    // Save guild
    await guildDB?.save()?.then(async () => {
      logger?.verbose(`Guild audits updated.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":hammer: Settings - Guild [Audits]",
            description: `Audits settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Status",
                value: `${guildDB?.audits?.status}`,
                inline: true,
              },
              {
                name: "🌊 Channel",
                value: `${guildDB?.audits?.channelId}`,
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

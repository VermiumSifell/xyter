// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: { guildOnly: false, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("ping").setDescription("Ping this bot");
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const interactionEmbed = {
      title: "[:tools:] Ping",
      fields: [
        {
          name: "📦 Deliver Latency",
          value: `${Math.abs(Date.now() - interaction.createdTimestamp)} ms`,
          inline: true,
        },
        {
          name: "🤖 API Latency",
          value: `${Math.round(interaction.client.ws.ping)} ms`,
          inline: true,
        },
      ],
      color: successColor,
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };
    await interaction.editReply({
      embeds: [interactionEmbed],
    });
  },
};

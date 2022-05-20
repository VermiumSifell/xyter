// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import getEmbedConfig from "@helpers/getEmbedConfig";

import { hosterName, hosterUrl } from "@config/other";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: { guildOnly: false, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("about").setDescription("About this bot!)");
  },
  execute: async (interaction: CommandInteraction) => {
    if (interaction.guild == null) return;
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const interactionEmbed = {
      title: ":hammer: Utilities [About]",
      description: `This bot is hosted by ${
        hosterUrl ? `[${hosterName}](${hosterUrl})` : `${hosterName}`
      }, the bot is developed by [Zyner](https://github.com/ZynerOrg)!

    If you are interested in contributing, then just [fork it](https://github.com/ZynerOrg/xyter) yourself, we :heart: Open Source.`,
      color: successColor,
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };
    interaction?.editReply({ embeds: [interactionEmbed] });
  },
};

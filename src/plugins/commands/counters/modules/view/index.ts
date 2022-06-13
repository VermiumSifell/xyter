import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

import counterSchema from "../../../../../models/counter";

export default {
  metadata: { guildOnly: true, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription(`View a guild counter`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            `The channel that contains the counter you want to view`
          )
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },

  execute: async (interaction: CommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");

    const embed = new MessageEmbed()
      .setTitle("[:1234:] Counters (View)")
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(`No counter found for channel ${discordChannel}!`)
            .setColor(errorColor),
        ],
      });
    }

    return interaction?.editReply({
      embeds: [
        embed
          .setDescription(
            `Viewing counter for channel ${discordChannel}: ${counter.counter}!`
          )
          .setColor(successColor),
      ],
    });
  },
};

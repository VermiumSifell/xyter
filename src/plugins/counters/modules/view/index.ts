// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

import counterSchema from "@schemas/counter";

// Configuration
import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription("View a counter's count.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The counter channel you want to view.")
          .setRequired(true)
          .addChannelType(ChannelType.GuildText as number)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:1234:] Counters (View)")
            .setDescription(`${discordChannel} is not a counting channel!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      });
    }

    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:1234:] Counters (View)")
          .setDescription(
            `${discordChannel} is currently at number ${counter?.counter}.`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({
            text: footerText,
            iconURL: footerIcon,
          }),
      ],
    });
  },
};

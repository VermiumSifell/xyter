// Dependencies
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription("View a counter.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The counter channel you want to view")
          .setRequired(true)
          .addChannelType(ChannelType.GuildText as number)
      );
  },
  execute: async (interaction: CommandInteraction, tools: any) => {
    const { options, guild } = interaction;
    const { colors, footer } = tools.config;

    const discordChannel = options?.getChannel("channel");

    const counter = await tools.schemas.counter?.findOne({
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
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
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
          .setColor(colors?.success as ColorResolvable)
          .setFooter({ text: footer?.text, iconURL: footer?.icon }),
      ],
    });
  },
};

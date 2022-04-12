// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";

// Configurations
import { colors, footer } from "../../../../../config.json";

// Models
import counterSchema from "../../../../database/schemas/counter";

// Function
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

// Dependencies
import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import { colors, footer } from "../../../../../../config.json";

// Handlers
import logger from "../../../../../logger";

// Models
import counterSchema from "../../../../../database/schemas/counter";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("delete")
      .setDescription("Delete a counter from your guild.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel that you want to delete a counter from.")
          .setRequired(true)
          .addChannelType(ChannelType.GuildText as number)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, guild, user } = interaction;

    const discordChannel = options?.getChannel("channel");

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Admin - Counters (Delete)")
            .setDescription(`${discordChannel} is not a counting channel!`)
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
        ],
      });
    }

    await counterSchema
      ?.deleteOne({
        guildId: guild?.id,
        channelId: discordChannel?.id,
      })
      ?.then(async () => {
        return interaction?.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:toolbox:] Admin - Counters (Delete)")
              .setDescription(
                `${discordChannel} is no longer an counting channel.`
              )
              .setTimestamp(new Date())
              .setColor(colors?.success as ColorResolvable)
              .setFooter({ text: footer?.text, iconURL: footer?.icon }),
          ],
        });
      });

    logger?.verbose(
      `Guild: ${guild?.id} User: ${user?.id} removed ${discordChannel?.id} as a counter.`
    );
  },
};

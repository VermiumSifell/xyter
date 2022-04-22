// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import counterSchema from "@schemas/counter";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("delete")
      .setDescription(`Delete a counter from your guild.`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to delete the counter from.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
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
      logger?.verbose(`Counter is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Counters (Delete)")
            .setDescription(`The counter for this channel does not exist.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    await counterSchema
      ?.deleteOne({
        guildId: guild?.id,
        channelId: discordChannel?.id,
      })
      ?.then(async () => {
        logger?.verbose(`Counter deleted`);

        return interaction?.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:toolbox:] Manage - Counters (Delete)")
              .setDescription(`The counter for this channel has been deleted.`)
              .setTimestamp(new Date())
              .setColor(successColor)
              .setFooter({ text: footerText, iconURL: footerIcon }),
          ],
        });
      })
      .catch(async (error) => {
        logger?.error(`Error deleting counter: ${error}`);
      });
  },
};

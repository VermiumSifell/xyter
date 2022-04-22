// Dependencies
import { MessageEmbed, CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

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

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("create")
      .setDescription("Add a counter to your guild.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send the counter to.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The word to use for the counter.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("start")
          .setDescription("The starting value of the counter.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");
    const countingWord = options?.getString("word");
    const startValue = options?.getNumber("start");

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Counters (Create)")
            .setDescription(`A counter already exists for this channel.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    await counterSchema
      ?.create({
        guildId: guild?.id,
        channelId: discordChannel?.id,
        word: countingWord,
        counter: startValue || 0,
      })
      .then(async () => {
        logger?.verbose(`Created counter`);

        return interaction?.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:toolbox:] Manage - Counters (Create)")
              .setDescription(`Created counter for ${discordChannel}`)
              .setTimestamp(new Date())
              .setColor(successColor)
              .setFooter({ text: footerText, iconURL: footerIcon }),
          ],
        });
      });
  },
};

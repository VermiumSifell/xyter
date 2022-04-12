// Dependencies
import { ColorResolvable, MessageEmbed, CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Configurations
import { colors, footer } from "../../../../../../config.json";

// Handlers
import logger from "../../../../../handlers/logger";

// Models
import counterSchema from "../../../../../database/schemas/counter";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("create")
      .setDescription("Add a counter to your guild.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel you want to add a counter to.")
          .setRequired(true)
          .addChannelType(ChannelType.GuildText as number)
      )
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The word you want to count.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("start")
          .setDescription("The count that the counter will start at.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, guild, user } = interaction;

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
            .setTitle("[:toolbox:] Admin - Counters (Create)")
            .setDescription(
              `${discordChannel} is already a counting channel, currently it's counting ${counter.word}!`
            )
            .setTimestamp(new Date())
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
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
        logger?.debug(
          `Guild: ${guild?.id} User: ${user?.id} added ${discordChannel?.id} as a counter using word "${countingWord}" for counting.`
        );

        return interaction?.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:toolbox:] Admin - Counters (Create)")
              .setDescription(
                `${discordChannel} is now counting when hearing word ${countingWord} and it starts at number ${
                  startValue || 0
                }.`
              )
              .setTimestamp(new Date())
              .setColor(colors?.success as ColorResolvable)
              .setFooter({ text: footer?.text, iconURL: footer?.icon }),
          ],
        });
      });
  },
};

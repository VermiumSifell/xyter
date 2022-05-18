// Dependencies
import { MessageEmbed, CommandInteraction, Permissions } from "discord.js";
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
import i18next from "i18next";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("add")
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
    const { options, guild, locale } = interaction;

    const discordChannel = options?.getChannel("channel");
    const countingWord = options?.getString("word");
    const startValue = options?.getNumber("start");

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("manage:groups:counters:modules:add:general:title", {
          lng: locale,
          ns: "plugins",
        })
      )
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter) {
      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t(
                "manage:groups:counters:modules:add:error01:description",
                {
                  lng: locale,
                  ns: "plugins",
                  channel: discordChannel,
                }
              )
            )
            .setColor(errorColor),
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
            embed
              .setDescription(
                i18next.t(
                  "manage:groups:counters:modules:create:success01:description",
                  {
                    lng: locale,
                    ns: "plugins",
                    channel: discordChannel,
                  }
                )
              )
              .setColor(successColor),
          ],
        });
      });
  },
};

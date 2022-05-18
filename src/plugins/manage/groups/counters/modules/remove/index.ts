// Dependencies
import { CommandInteraction, MessageEmbed, Permissions } from "discord.js";

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
      .setName("remove")
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
    const { options, guild, locale } = interaction;

    const discordChannel = options?.getChannel("channel");

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("manage:groups:counters:modules:remove:general:title", {
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

    if (counter === null) {
      logger?.verbose(`Counter is null`);

      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t(
                "manage:groups:counters:modules:remove:error01:description",
                {
                  lng: locale,
                  ns: "plugins",
                }
              )
            )
            .setColor(errorColor),
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
            embed
              .setDescription(
                i18next.t(
                  "manage:groups:counters:modules:remove:success01:description",
                  {
                    lng: locale,
                    ns: "plugins",
                  }
                )
              )
              .setColor(successColor),
          ],
        });
      })
      .catch(async (error) => {
        logger?.error(`Error deleting counter: ${error}`);
      });
  },
};

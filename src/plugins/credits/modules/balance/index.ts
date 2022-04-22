import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

import i18next from "i18next";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import logger from "@logger";

import fetchUser from "@helpers/fetchUser";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("balance")
      .setDescription(`View a user's balance`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription(`The user whose balance you want to view`)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, user, guild, locale } = interaction;

    const discordUser = options.getUser("user");

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("credits:modules:balance:general:title", {
          lng: locale,
          ns: "plugins",
        })
      )
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.verbose(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("guildOnly", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    const userObj = await fetchUser(discordUser || user, guild);

    if (userObj === null) {
      logger.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("userNotFound", {
                lng: locale,
                ns: "errors",
                user: discordUser || user,
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    if (userObj.credits === null) {
      logger.verbose(`User has no credits`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:balance:error01:description", {
                lng: locale,
                ns: "plugins",
                user: discordUser || user,
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    logger.verbose(`Found user ${discordUser || user}`);

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            i18next.t("credits:modules:balance:success01:description", {
              lng: locale,
              ns: "plugins",
              user: discordUser || user,
              amount: userObj.credits,
            })
          )
          .setColor(successColor),
      ],
    });
  },
};

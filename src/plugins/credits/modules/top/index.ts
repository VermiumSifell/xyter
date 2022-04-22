import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import i18next from "i18next";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import logger from "@logger";

import userSchema, { IUser } from "@schemas/user";

export default {
  meta: { guildOnly: true, ephemeral: false },

  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("top").setDescription(`View the top users`);
  },
  execute: async (interaction: CommandInteraction) => {
    const { locale, guild } = interaction;

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("credits:modules:top:general:title", {
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

    const usersDB = await userSchema.find({ guildId: guild.id });

    const topTen = usersDB

      // Sort them after credits amount (ascending)
      .sort((a, b) => (a.credits > b.credits ? -1 : 1))

      // Return the top 10
      .slice(0, 10);

    // Create entry object
    const entry = (x: IUser, index: number) =>
      i18next.t("credits:modules:top:entry", {
        lng: locale,
        ns: "plugins",
        index: index + 1,
        user: x.userId,
        amount: x.credits,
      });

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            ` ${i18next.t("credits:modules:top:success01:description", {
              lng: locale,
              ns: "plugins",
            })}

            ${topTen.map(entry).join("\n")}
         `
          )
          .setColor(successColor),
      ],
    });
  },
};

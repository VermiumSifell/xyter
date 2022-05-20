import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import logger from "@logger";

import fetchUser from "@helpers/fetchUser";

export default {
  metadata: { guildOnly: true, ephemeral: true },
  builder: (command: SlashCommandSubcommandBuilder) => {
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
    const { options, user, guild } = interaction;

    const discordUser = options.getUser("user");

    const embed = new MessageEmbed()
      .setTitle("[:dollar:] Balance")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.silly(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Guild is not found").setColor(errorColor),
        ],
      });
    }

    const userObj = await fetchUser(discordUser || user, guild);

    if (userObj === null) {
      logger.silly(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "User is not found. Please try again with a valid user."
            )
            .setColor(errorColor),
        ],
      });
    }

    if (userObj.credits === null) {
      logger.silly(`User has no credits`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Credits not found").setColor(errorColor),
        ],
      });
    }

    logger.silly(`Found user ${discordUser || user}`);

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${discordUser || user} currently has ${userObj.credits} credits.`
          )
          .setColor(successColor),
      ],
    });
  },
};

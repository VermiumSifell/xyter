// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Configurations
import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Helpers
import pluralize from "@helpers/pluralize";
import fetchUser from "@helpers/fetchUser";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return (
      command
        .setName("balance")
        .setDescription("Check a user's balance.")

        // User
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user whose balance you want to check.")
        )
    );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, user, guild } = interaction;

    const discordUser = options?.getUser("user");

    if (guild === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Balance)")
            .setDescription(`We can not find your guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const userObj = await fetchUser(discordUser || user, guild);

    if (userObj === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Balance)")
            .setDescription(
              `We can not find ${discordUser || "you"} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (userObj.credits === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Balance)")
            .setDescription(
              `We can not find credits for ${
                discordUser || "you"
              } in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:dollar:] Credits (Balance)")
          .setDescription(
            `${discordUser || "You"} have ${pluralize(
              userObj.credits,
              "credit"
            )}.`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  },
};

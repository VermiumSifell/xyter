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
    return command
      .setName("balance")
      .setDescription("Check a user's balance.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user whose balance you want to check.")
          .setRequired(false)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { options, user, guild } = interaction;

    // User option
    const optionUser = options?.getUser("user");

    if (guild === null) return;

    // Get credit object
    const userObj = await fetchUser(optionUser || user, guild);

    // If userObj does not exist
    if (userObj === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Balance)")
            .setDescription(
              `We can not find ${optionUser || "you"} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If userObj.credits does not exist
    if (userObj.credits === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Balance)")
            .setDescription(
              `We can not find credits for ${
                optionUser || "you"
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
            `${optionUser || "You"} have ${pluralize(
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

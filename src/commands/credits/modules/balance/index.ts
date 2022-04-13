// Dependencies
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";

// Configurations
import { colors, footer } from "../../../../../config.json";

// Helpers
import pluralize from "../../../../helpers/pluralize";

// Models
import fetchUser from "../../../../helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
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
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
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
            .setColor(colors?.error as ColorResolvable)
            .setFooter({ text: footer?.text, iconURL: footer?.icon }),
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
          .setColor(colors?.success as ColorResolvable)
          .setFooter({ text: footer?.text, iconURL: footer?.icon }),
      ],
    });
  },
};

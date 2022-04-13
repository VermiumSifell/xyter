// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Helpers
import pluralize from "@helpers/pluralize";
import saveUser from "@helpers/saveUser";

// Models
import fetchUser from "@helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("transfer")
      .setDescription("Transfer credits from a user to another user.")
      .addUserOption((option) =>
        option
          .setName("from")
          .setDescription("The user you want to take credits from.")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("to")
          .setDescription("The user you want to give credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount you will transfer.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, options, user } = interaction;

    // Get options
    const optionFromUser = options?.getUser("from");
    const optionToUser = options?.getUser("to");
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`We could not read your requested amount!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (guild === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`We could not read your guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (optionFromUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`We could not read your requested from user!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (optionToUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`We could not read your requested to user!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Get fromUser object
    const fromUser = await fetchUser(optionFromUser, guild);

    // Get toUser object
    const toUser = await fetchUser(optionToUser, guild);

    // If toUser does not exist
    if (fromUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `We could not read your requested from user from our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (!fromUser?.credits) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `We could not find credits for ${optionFromUser} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser does not exist
    if (toUser === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `We could not read your requested to user from our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (toUser?.credits === null) {
      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `We could not find credits for ${optionToUser} in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Withdraw amount from fromUser
    fromUser.credits -= optionAmount;

    // Deposit amount to toUser
    toUser.credits += optionAmount;

    // Save users
    await saveUser(fromUser, toUser)?.then(async () => {
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} transferred ${pluralize(
          optionAmount,
          "credit"
        )} from ${optionFromUser?.id} to ${optionToUser?.id}.`
      );

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `We have sent ${pluralize(
                optionAmount,
                "credit"
              )} from ${optionFromUser} to ${optionToUser}.`
            )
            .addFields(
              {
                name: `${optionFromUser?.username} Balance`,
                value: `${fromUser?.credits}`,
                inline: true,
              },
              {
                name: `${optionToUser?.username} Balance`,
                value: `${toUser?.credits}`,
                inline: true,
              }
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
  },
};

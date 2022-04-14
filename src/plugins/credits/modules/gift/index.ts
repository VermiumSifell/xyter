// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Helpers
import saveUser from "@helpers/saveUser";

// Models
import fetchUser from "@helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("gift")
      .setDescription(`Gift a user credits`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to gift credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of credits you want to gift.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("Your reason.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, user, guild, client } = interaction;

    const optionUser = options?.getUser("user");
    const optionAmount = options?.getInteger("amount");
    const optionReason = options?.getString("reason");

    if (guild === null) {
      logger?.verbose(`Guild is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(`We can not find your guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (optionUser === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(`We can not find your requested user!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Get fromUserDB object
    const fromUserDB = await fetchUser(user, guild);

    // Get toUserDB object
    const toUserDB = await fetchUser(optionUser, guild);

    if (fromUserDB === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `We can not find your requested from user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (toUserDB === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `We can not find your requested to user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If receiver is same as sender
    if (optionUser?.id === user?.id) {
      logger?.verbose(`User is same as sender`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(`You can not pay yourself!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is null
    if (optionAmount === null) {
      logger?.verbose(`Amount is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(`We could not read your requested amount!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger?.verbose(`Amount is zero or below`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(`You can't gift zero or below!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If user has below gifting amount
    if (fromUserDB?.credits < optionAmount) {
      logger?.verbose(`User has below gifting amount`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `You have insufficient credits. Your balance is ${fromUserDB?.credits}!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUserDB has no credits
    if (toUserDB === null) {
      logger?.verbose(`User has no credits`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `We can not find your requested to user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Withdraw amount from fromUserDB
    fromUserDB.credits -= optionAmount;

    // Deposit amount to toUserDB
    toUserDB.credits += optionAmount;

    // Save users
    await saveUser(fromUserDB, toUserDB)?.then(async () => {
      // Get DM user object
      const dmUser = client?.users?.cache?.get(optionUser?.id);

      // Send DM to user
      await dmUser
        ?.send({
          embeds: [
            new MessageEmbed()
              .setTitle("[:dollar:] Credits (Gift)")
              .setDescription(
                `You have received ${optionAmount} credits from ${
                  user?.tag
                } with reason ${
                  optionReason ? ` with reason: ${optionReason}` : ""
                }!`
              )
              .setTimestamp(new Date())
              .setColor(successColor)
              .setFooter({ text: footerText, iconURL: footerIcon }),
          ],
        })
        .catch(async (error) =>
          logger?.error(`[Gift] Error sending DM to user: ${error}`)
        );

      logger?.verbose(
        `[Gift] Successfully gifted ${optionAmount} credits to ${optionUser?.tag}`
      );

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `Successfully gifted ${optionAmount} credits to ${optionUser?.tag}!`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
  },
};

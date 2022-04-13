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
import logger from "../../../../logger";

// Helpers
import saveUser from "../../../../helpers/saveUser";
import pluralize from "../../../../helpers/pluralize";

// Models
import fetchUser from "../../../../helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("gift")
      .setDescription("Gift someone credits from your credits.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to pay.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount you will pay.")
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
                `You received ${pluralize(
                  optionAmount,
                  "credit"
                )} from ${user}${
                  optionReason ? ` with reason: ${optionReason}` : ""
                }. Your new credits is ${pluralize(
                  toUserDB?.credits,
                  "credit"
                )}.`
              )
              .setTimestamp(new Date())
              .setColor(successColor)
              .setFooter({ text: footerText, iconURL: footerIcon }),
          ],
        })
        .catch(async () =>
          logger.debug(`Can not send DM to user ${optionUser?.id}`)
        );

      // Send debug message
      logger.debug(
        `Guild: ${guild?.id} User: ${user?.id} gift sent from: ${user?.id} to: ${optionUser?.id}`
      );

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:dollar:] Credits (Gift)")
            .setDescription(
              `You sent ${pluralize(optionAmount, "credit")} to ${optionUser}${
                optionReason ? ` with reason: ${optionReason}` : ""
              }. Your new credits is ${pluralize(
                fromUserDB?.credits,
                "credit"
              )}.`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
  },
};

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
import i18next from "i18next";

// Function
export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
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
    const { options, user, guild, client, locale } = interaction;

    const optionUser = options.getUser("user");
    const optionAmount = options.getInteger("amount");
    const optionReason = options.getString("reason");

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("credits:modules:gift:general:title", {
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

    if (optionUser === null) {
      logger.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("userNotFound", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // Get fromUserDB object
    const fromUserDB = await fetchUser(user, guild);

    // Get toUserDB object
    const toUserDB = await fetchUser(optionUser, guild);

    if (fromUserDB === null) {
      logger.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("userNotFound", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    if (toUserDB === null) {
      logger.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("userNotFound", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // If receiver is same as sender
    if (optionUser.id === user.id) {
      logger.verbose(`User is same as sender`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:gift:error01:description", {
                lng: locale,
                ns: "plugins",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // If amount is null
    if (optionAmount === null) {
      logger.verbose(`Amount is null`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("amountNotFound", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger.verbose(`Amount is zero or below`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:gift:error02:description", {
                lng: locale,
                ns: "plugins",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // If user has below gifting amount
    if (fromUserDB.credits < optionAmount) {
      logger.verbose(`User has below gifting amount`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:gift:error03:description", {
                lng: locale,
                ns: "plugins",
                amount: fromUserDB.credits,
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // If toUserDB has no credits
    if (toUserDB === null) {
      logger.verbose(`User has no credits`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("userNotFound", {
                lng: locale,
                ns: "errors",
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    // Withdraw amount from fromUserDB
    fromUserDB.credits -= optionAmount;

    // Deposit amount to toUserDB
    toUserDB.credits += optionAmount;

    // Save users
    await saveUser(fromUserDB, toUserDB).then(async () => {
      // Get DM user object
      const dmUser = client.users.cache.get(optionUser.id);

      if (dmUser == null) return;

      // Send DM to user
      await dmUser
        .send({
          embeds: [
            embed
              .setDescription(
                i18next.t("credits:modules:gift:error03:description", {
                  lng: locale,
                  ns: "plugins",
                  user: user.tag,
                  amount: optionAmount,
                  reason: optionReason || "unspecified",
                })
              )
              .setColor(successColor),
          ],
        })
        .catch(async (error) =>
          logger.error(`[Gift] Error sending DM to user: ${error}`)
        );

      logger.verbose(
        `[Gift] Successfully gifted ${optionAmount} credits to ${optionUser.tag}`
      );

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("credits:modules:gift:success02:description", {
                lng: locale,
                ns: "plugins",
                user: user,
                amount: optionAmount,
                reason: optionReason || "unspecified",
              })
            )
            .setColor(successColor),
        ],
      });
    });
  },
};

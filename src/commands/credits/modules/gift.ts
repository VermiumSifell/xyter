// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../config.json";

// Handlers
import logger from "../../../handlers/logger";

// Helpers
import saveUser from "../../../helpers/saveUser";
import creditNoun from "../../../helpers/creditNoun";

// Models
import fetchUser from "../../../helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, user, guild, client } = interaction;

  // User option
  const optionUser = options?.getUser("user");

  // Amount option
  const optionAmount = options?.getInteger("amount");

  // Reason option
  const optionReason = options?.getString("reason");

  if (guild === null) return;
  if (optionUser === null) return;

  // Get fromUserDB object
  const fromUserDB = await fetchUser(user, guild);

  // Get toUserDB object
  const toUserDB = await fetchUser(optionUser, guild);

  if (fromUserDB === null) return;
  if (toUserDB === null) return;

  // If receiver is same as sender
  if (optionUser?.id === user?.id) {
    // Create embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description: "You can't pay yourself." as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // If amount is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description: "We could not read your requested amount." as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // If amount is zero or below
  if (optionAmount <= 0) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description: "You can't pay zero or below." as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // If user has below gifting amount
  if (fromUserDB?.credits < optionAmount) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description:
        `You have insufficient credits. Your credits is ${fromUserDB?.credits}` as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // If toUserDB has no credits
  if (!toUserDB) {
    // Embed object
    const embed = {
      title: ":dollar: Credits [Gift]" as string,
      description:
        `That user has no credits, I can not gift credits to ${optionUser}` as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // Withdraw amount from fromUserDB
  fromUserDB.credits -= optionAmount;

  // Deposit amount to toUserDB
  toUserDB.credits += optionAmount;

  // Save users
  await saveUser(fromUserDB, toUserDB)?.then(async () => {
    // Interaction embed object
    const interactionEmbed = {
      title: ":dollar: Credits [Gift]",
      description: `You sent ${creditNoun(optionAmount)} to ${optionUser}${
        optionReason ? ` with reason: ${optionReason}` : ""
      }. Your new credits is ${creditNoun(fromUserDB?.credits)}.`,
      color: config?.colors?.success as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // DM embed object
    const dmEmbed = {
      title: ":dollar: Credits [Gift]" as string,
      description: `You received ${creditNoun(optionAmount)} from ${user}${
        optionReason ? ` with reason: ${optionReason}` : ""
      }. Your new credits is ${creditNoun(toUserDB?.credits)}.` as string,
      color: config?.colors?.success as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Get DM user object
    const dmUser = client?.users?.cache?.get(interaction?.user?.id);

    // Send DM to user
    await dmUser?.send({ embeds: [dmEmbed] });

    // Send debug message
    logger.debug(
      `Guild: ${guild?.id} User: ${user?.id} gift sent from: ${user?.id} to: ${optionUser?.id}`
    );

    // Send interaction reply
    return await interaction.editReply({
      embeds: [interactionEmbed],
    });
  });
};

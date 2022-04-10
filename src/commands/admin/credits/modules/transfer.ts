// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../../config.json";

// Handlers
import logger from "../../../../handlers/logger";

// Helpers
import creditNoun from "../../../../helpers/creditNoun";
import saveUser from "../../../../helpers/saveUser";

// Models
import userSchema from "../../../../helpers/database/models/userSchema";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, options, user } = interaction;

  // Get options
  const optionFromUser = options?.getUser("from");
  const optionToUser = options?.getUser("to");
  const optionAmount = options?.getInteger("amount");

  // If amount is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
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

  // Get fromUser object
  const fromUser = await userSchema?.findOne({
    userId: optionFromUser?.id,
    guildId: guild?.id,
  });

  // Get toUser object
  const toUser = await userSchema.findOne({
    userId: optionToUser?.id,
    guildId: guild?.id,
  });

  // If toUser does not exist
  if (!fromUser) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
      description:
        `We could not find ${optionFromUser} in our database.` as string,
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

  // If toUser.credits does not exist
  if (!fromUser?.credits) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
      description:
        `We could not find credits for ${optionFromUser} in our database.` as string,
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

  // If toUser does not exist
  if (!toUser) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
      description:
        `We could not find ${optionToUser} in our database.` as string,
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

  // If toUser.credits does not exist
  if (!toUser?.credits) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
      description:
        `We could not find credits for ${optionToUser} in our database.` as string,
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

  // Withdraw amount from fromUser
  fromUser.credits -= optionAmount;

  // Deposit amount to toUser
  toUser.credits += optionAmount;

  // Save users
  await saveUser(fromUser, toUser)?.then(async () => {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]" as string,
      description: `You sent ${creditNoun(
        optionAmount
      )} from ${optionFromUser} to ${optionToUser}.` as string,
      color: config?.colors?.success as ColorResolvable,
      fields: [
        {
          name: `${optionFromUser?.username as string} Balance`,
          value: `${fromUser?.credits as string}`,
          inline: true,
        },
        {
          name: `${optionToUser?.username as string} Balance`,
          value: `${toUser?.credits as string}`,
          inline: true,
        },
      ],
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Log debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} transferred ${creditNoun(
        optionAmount
      )} from ${optionFromUser?.id} to ${optionToUser?.id}.`
    );

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  });
};

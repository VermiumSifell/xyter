// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../../config.json";

// Handlers
import logger from "../../../../handlers/logger";

// Helpers
import creditNoun from "../../../../helpers/creditNoun";

// Models
import userSchema from "../../../../helpers/database/models/userSchema";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { guild, user, options } = interaction;

  // User option
  const optionUser = options?.getUser("user");

  // Amount option
  const optionAmount = options?.getInteger("amount");

  // If amount option is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]" as string,
      description: "We could not read your requested amount." as string,
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

  // If amount is zero or below
  if (optionAmount <= 0) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]" as string,
      description: "You can not give zero credits or below." as string,
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

  // toUser Information
  const toUser = await userSchema?.findOne({
    userId: optionUser?.id,
    guildId: guild?.id,
  });

  // If toUser does not exist
  if (!toUser) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]" as string,
      description: `We could not find ${optionUser} in our database.` as string,
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
      title: ":toolbox: Admin - Credits [Give]" as string,
      description:
        `We could not find credits for ${optionUser} in our database.` as string,
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

  // Deposit amount to toUser
  toUser.credits += optionAmount;

  // Save toUser
  await toUser?.save()?.then(async () => {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]" as string,
      description: `We have given ${optionUser}, ${creditNoun(
        optionAmount
      )}.` as string,
      color: config?.colors?.success as ColorResolvable,
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Log debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} gave ${
        optionUser?.id
      } ${creditNoun(optionAmount)}.`
    );

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  });
};

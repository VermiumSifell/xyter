// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../../../config.json";

// Handlers
import logger from "../../../../../handlers/logger";

// Helpers
import pluralize from "../../../../../helpers/pluralize";

// Models
import fetchUser from "../../../../../helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, user, guild } = interaction;

  // User Option
  const optionUser = options.getUser("user");

  // Amount Option
  const optionAmount = options.getInteger("amount");

  // If amount is null
  if (optionAmount === null) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]" as string,
      description: "We could not read your requested amount." as string,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  if (optionUser === null) return;
  if (guild === null) return;

  // toUser Information
  const toUser = await fetchUser(optionUser, guild);

  // If toUser does not exist
  if (!toUser) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]" as string,
      description: `We could not find ${optionUser} in our database.`,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  // If toUser.credits does not exist
  if (toUser?.credits === null) {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]" as string,
      description: `We could not find credits for ${optionUser} in our database.`,
      color: config?.colors?.error as ColorResolvable,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  // Set toUser with amount
  toUser.credits = optionAmount;

  // Save toUser
  await toUser?.save()?.then(async () => {
    // Embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]" as string,
      description: `We have set ${optionUser} to ${pluralize(
        optionAmount,
        "credit"
      )}`,
      color: config?.colors?.success as ColorResolvable,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Log debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} set ${
        optionUser?.id
      } to ${pluralize(optionAmount, "credit")}.`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  });
};

// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { timeout } from "@config/reputation";

// Handlers
import logger from "@logger";

// Models
import timeoutSchema from "@schemas/timeout";
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, user, guild } = interaction;

  // Target option
  const optionTarget = options?.getUser("target");

  // Type information
  const optionType = options?.getString("type");

  if (guild === null) return;

  // User information
  const userObj = await fetchUser(user, guild);

  if (userObj === null) return;

  // Check if user has a timeout
  const isTimeout = await timeoutSchema?.findOne({
    guildId: guild?.id,
    userId: user?.id,
    timeoutId: "2022-04-10-16-42",
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Do not allow self reputation
    if (optionTarget?.id === user?.id) {
      // Embed object
      const embed = {
        title: ":loudspeaker: Reputation [Give]",
        description: "You can not repute yourself.",
        timestamp: new Date(),
        color: errorColor,
        footer: {
          iconURL: footerIcon,
          text: footerText,
        },
      };

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    }

    // If type is positive
    if (optionType === "positive") {
      userObj.reputation += 1;
    }

    // If type is negative
    else if (optionType === "negative") {
      userObj.reputation -= 1;
    }

    // Save user
    await userObj?.save()?.then(async () => {
      // Embed object
      const embed = {
        title: ":loudspeaker: Reputation [Give]",
        description: `You have given ${optionTarget} a ${optionType} reputation!`,
        timestamp: new Date(),
        color: successColor,
        footer: {
          iconURL: footerIcon,
          text: footerText,
        },
      };

      // Log debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has given ${optionTarget?.id} a ${optionType} reputation.`
      );

      // Create a timeout for the user
      await timeoutSchema?.create({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-04-10-16-42",
      });
      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    });

    setTimeout(async () => {
      // send debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has not repute within last ${timeout} seconds, reputation can be given`
      );

      // When timeout is out, remove it from the database
      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-04-10-16-42",
      });
    }, timeout);
  } else {
    // Create embed object
    const embed = {
      title: ":loudspeaker: Reputation [Give]",
      description: `You have given reputation within the last ${timeout} seconds, you can not repute now!`,
      timestamp: new Date(),
      color: errorColor,
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };

    // Log debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} has repute within last ${timeout} seconds, no reputation can be given`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }
};

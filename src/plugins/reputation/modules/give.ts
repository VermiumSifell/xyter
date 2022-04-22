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
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give reputation to a user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to repute.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("What type of reputation you want to repute")
          .setRequired(true)
          .addChoices(
            { name: "Positive", value: "positive" },
            {
              name: "Negative",
              value: "negative",
            }
          )
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { options, user, guild } = interaction;

    // Target option
    const optionTarget = options?.getUser("target");

    // Type information
    const optionType = options?.getString("type");

    if (guild === null) {
      return logger?.verbose(`Guild is null`);
    }

    // User information
    const userObj = await fetchUser(user, guild);

    if (userObj === null) {
      return logger?.verbose(`User is null`);
    }

    // Check if user has a timeout
    const isTimeout = await timeoutSchema?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-04-10-16-42",
    });

    // If user is not on timeout
    if (isTimeout) {
      logger?.verbose(`User is on timeout`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":loudspeaker: Reputation [Give]",
            description: `You cannot give reputation while on timeout, please wait ${timeout} seconds.`,
            timestamp: new Date(),
            color: errorColor,
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    }

    // Do not allow self reputation
    if (optionTarget?.id === user?.id) {
      logger?.verbose(`User is trying to give reputation to self`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":loudspeaker: Reputation [Give]",
            description: `You cannot give reputation to yourself.`,
            timestamp: new Date(),
            color: errorColor,
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    }

    // If type is positive
    if (optionType === "positive") {
      logger?.verbose(`User is giving positive reputation`);

      userObj.reputation += 1;
    }

    // If type is negative
    else if (optionType === "negative") {
      logger?.verbose(`User is giving negative reputation`);

      userObj.reputation -= 1;
    }

    // Save user
    await userObj?.save()?.then(async () => {
      logger?.verbose(`User reputation has been updated`);

      await timeoutSchema?.create({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-04-10-16-42",
      });

      return interaction?.editReply({
        embeds: [
          {
            title: ":loudspeaker: Reputation [Give]",
            description: `You have given reputation to ${optionTarget}`,
            timestamp: new Date(),
            color: successColor,
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });

    setTimeout(async () => {
      logger?.verbose(`Removing timeout`);

      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-04-10-16-42",
      });
    }, timeout);
  },
};

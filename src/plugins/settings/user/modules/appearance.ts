// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "../../../../logger";

// Models
import fetchUser from "../../../../helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, user, guild } = interaction;

  // Get options
  const language = options?.getString("language");

  if (guild === null) return;

  // Get user object
  const userDB = await fetchUser(user, guild);

  if (userDB === null) return;

  // Modify values
  userDB.language = language !== null ? language : userDB?.language;

  // Save guild
  await userDB?.save()?.then(async () => {
    // Embed object
    const embed = {
      title: ":hammer: Settings - User [Appearance]",
      description: "Following settings is set!",
      color: successColor,
      fields: [
        {
          name: "🏳️‍🌈 Language",
          value: `${userDB?.language}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} has changed appearance settings.`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  });
};

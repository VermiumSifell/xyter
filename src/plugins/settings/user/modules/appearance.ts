// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, user, guild } = interaction;

  // Get options
  const language = options?.getString("language");

  if (guild === null) {
    return logger?.verbose(`Guild is null`);
  }

  // Get user object
  const userDB = await fetchUser(user, guild);

  if (userDB === null) {
    return logger?.verbose(`User is null`);
  }

  // Modify values
  userDB.language = language !== null ? language : userDB?.language;

  // Save guild
  await userDB?.save()?.then(async () => {
    logger?.verbose(`Updated user language.`);

    return interaction?.editReply({
      embeds: [
        {
          title: ":hammer: Settings - User [Appearance]",
          description: "Successfully updated user settings.",
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
        },
      ],
    });
  });
};

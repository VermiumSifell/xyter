// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../../config.json";

// Handlers
import logger from "../../../../handlers/logger";

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
      title: ":hammer: Settings - User [Appearance]" as string,
      description: "Following settings is set!" as string,
      color: config?.colors?.success as ColorResolvable,
      fields: [
        {
          name: "🏳️‍🌈 Language" as string,
          value: `${userDB?.language}` as string,
          inline: true,
        },
      ],
      timestamp: new Date() as Date,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} has changed appearance settings.`
    );

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  });
};

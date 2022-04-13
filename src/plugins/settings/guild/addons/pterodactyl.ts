// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "../../../../logger";

// Models
import apiSchema from "../../../../database/schemas/api";
import encryption from "../../../../handlers/encryption";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, guild, user } = interaction;

  // Get options
  const url = options?.getString("url");
  const token = encryption.encrypt(options?.getString("token"));

  // Update API credentials
  await apiSchema
    ?.findOneAndUpdate(
      { guildId: guild?.id },
      { url, token },
      { new: true, upsert: true }
    )
    .then(async () => {
      // Embed object
      const embed = {
        title: ":hammer: Settings - Guild [Pterodactyl]",
        color: successColor,
        description: "Pterodactyl settings is saved!",
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon as string,
          text: footerText as string,
        },
      };

      // Send debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has changed api credentials.`
      );

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    });
};

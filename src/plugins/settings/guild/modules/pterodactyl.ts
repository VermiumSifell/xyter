// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "../../../../logger";

// Models
import apiSchema from "../../../../database/schemas/api";
import encryption from "../../../../handlers/encryption";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("pterodactyl")
      .setDescription("Controlpanel.gg")
      .addStringOption((option) =>
        option.setName("url").setDescription("The api url").setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("token")
          .setDescription("The api token")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
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
  },
};

// Dependencies
import { CommandInteraction, Permissions } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import apiSchema from "@schemas/api";
import encryption from "@handlers/encryption";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("pterodactyl")
      .setDescription("Controlpanel.gg")
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription(`Controlpanel.gg URL`)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("token")
          .setDescription(`Controlpanel.gg Token`)
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { options, guild } = interaction;

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
        logger?.silly(`Updated API credentials.`);

        return interaction?.editReply({
          embeds: [
            {
              title: ":hammer: Settings - Guild [Pterodactyl]",
              color: successColor,
              description: `Successfully updated API credentials.`,
              timestamp: new Date(),
              footer: {
                iconURL: footerIcon,
                text: footerText,
              },
            },
          ],
        });
      });
  },
};

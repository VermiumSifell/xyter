// Dependencies
import { CommandInteraction, Permissions } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../logger";

// Models
import apiSchema from "../../../../models/api";
import encryption from "../../../../handlers/encryption";
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
    if (interaction.guild == null) return;
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure member
    const { options, guild } = interaction;

    // Get options
    const tokenData = options.getString("token");
    const url = options.getString("url");
    const token = tokenData && encryption.encrypt(tokenData);

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

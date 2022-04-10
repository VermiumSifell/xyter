// Dependencies
import { ColorResolvable, CommandInteraction } from 'discord.js';

// Configurations
import config from '../../../../../config.json';

// Handlers
import logger from '../../../../handlers/logger';

// Models
import apiSchema from '../../../../helpers/database/models/apiSchema';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, guild, user } = interaction;

  // Get options
  const url = options?.getString('url');
  const token = options?.getString('token');

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
        title: ':hammer: Settings - Guild [Pterodactyl]' as string,
        color: config?.colors?.success as ColorResolvable,
        description: 'Pterodactyl settings is saved!' as string,
        timestamp: new Date() as Date,
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Send debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has changed api credentials.`
      );

      // Return interaction reply
      return await interaction?.editReply({ embeds: [embed] });
    });
};

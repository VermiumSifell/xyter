import { Permissions } from 'discord.js';
import config from '../../../../../config.json';
import logger from '../../../../handlers/logger';

// Database models
import { counters } from '../../../../helpers/database/models';

export default async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: 'Admin',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options
  const channel = await interaction.options.getChannel('channel');

  await counters
    .deleteOne({ guildId: member.guild.id, channelId: channel.id })
    .then(async () => {
      interaction.editReply({ content: 'Removed' });
    });

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed remove counter.`
  );
};

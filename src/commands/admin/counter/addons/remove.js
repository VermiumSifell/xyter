const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models
const { counters } = require('../../../../helpers/database/models');

module.exports = async (interaction) => {
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

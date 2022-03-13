const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { counters } = require('../../../helpers/database/models');

module.exports = async (interaction) => {
  try {
    // Destructure member
    const { member } = await interaction;

    // Get options
    const channel = await interaction.options.getChannel('channel');

    const counter = await counters.findOne({
      guildId: member.guild.id,
      channelId: channel.id,
    });

    if (!counter) {
      // Create embed object
      const embed = {
        title: 'Counter - View',
        description: `${channel} is not a counting channel.`,
        timestamp: new Date(),
        color: config.colors.error,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed] });
    }

    // Create embed object
    const embed = {
      title: 'Counter - View',
      color: config.colors.success,
      description: `${channel} is currently at number ${counter.counter}.`,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

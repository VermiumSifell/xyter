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
  const word = await interaction.options.getString('word');
  const start = await interaction.options.getNumber('start');

  if (channel.type !== 'GUILD_TEXT') {
    // Create embed object
    const embed = {
      title: 'Admin - Counter',
      description: `That channel is not supported, it needs to be a text channel.`,
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  const counterExist = await counters.findOne({
    guildId: member.guild.id,
    channelId: channel.id,
    word,
  });

  if (!counterExist) {
    await counters.create({
      guildId: member.guild.id,
      channelId: channel.id,
      word,
      counter: start || 0,
    });
    // Create embed object
    const embed = {
      title: 'Admin - Counter',
      description: `${channel} is now counting when hearing word ${word} and it starts at number ${
        start || 0
      }.`,
      timestamp: new Date(),
      color: config.colors.success,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send debug message
    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} added ${channel.id} as a counter using word "${word}" for counting.`
    );

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }
  // Create embed object
  const embed = {
    title: 'Admin - Counter',
    description: `${channel} is already a counting channel.`,
    timestamp: new Date(),
    color: config.colors.error,
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send interaction reply
  return await interaction.editReply({ embeds: [embed] });
};

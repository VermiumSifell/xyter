const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { buy, cancel } = require('./addons');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // If subcommand is buy
  if (interaction.options.getSubcommand() === 'buy') {
    // Execute buy addon
    await buy(interaction);
  }

  // If subcommand is cancel
  if (interaction.options.getSubcommand() === 'cancel') {
    // Execute cancel addon
    await cancel(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};

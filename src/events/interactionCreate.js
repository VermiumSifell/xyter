const config = require('../../config.json');
const logger = require('../handlers/logger');

const { guilds } = require('../helpers/database/models');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Destructure member, client
    const { member, client } = interaction;

    // If interaction is command
    if (interaction.isCommand()) {
      // Get command from collection
      const command = client.commands.get(interaction.commandName);

      // If command do not exist
      if (!command) return;

      // Create guild if it does not exist already
      await guilds.findOne(
        { guildId: member.guild.id },
        { new: true, upsert: true }
      );

      try {
        // Defer reply
        await interaction.deferReply({
          embeds: [
            {
              author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
                url: 'https://bot.zyner.org/',
              },
              title: 'Check',
              description: 'Please wait...',
              color: config.colors.wait,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });

        // Execute command
        await command.execute(interaction);

        // Send debug message
        await logger.debug(`Executing command: ${interaction.commandName}`);
      } catch (err) {
        // Send debug message
        await logger.error(err);

        // Send interaction reply
        await interaction.reply({
          embeds: [
            {
              author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
                url: 'https://bot.zyner.org/',
              },
              title: 'Error',
              description: 'There was an error while executing this command!',
              color: config.colors.error,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });
      }
    }
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const guilds = require('../../helpers/database/models/guildSchema');

const pterodactyl = require('./addons/pterodactyl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Open our shop.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('pterodactyl')
        .setDescription('Buy pterodactyl power.')
        .addIntegerOption((option) =>
          option
            .setName('amount')
            .setDescription('How much credits you want to withdraw.')
        )
    ),
  async execute(interaction) {
    // If subcommand is pterodactyl
    if (interaction.options.getSubcommand() === 'pterodactyl') {
      // Execute pterodactyl addon
      await pterodactyl(interaction);
    }
  },
};

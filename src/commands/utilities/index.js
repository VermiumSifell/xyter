const { SlashCommandBuilder } = require('@discordjs/builders');

const { lookup, about, stats } = require('./addons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('utilities')
    .setDescription('Common utilities.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lookup')
        .setDescription(
          'Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)'
        )
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('The query you want to look up.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('about').setDescription('About this bot!)')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('stats').setDescription('Check bot statistics!)')
    ),
  async execute(interaction) {
    // If subcommand is lookup
    if (interaction.options.getSubcommand() === 'lookup') {
      // Execute lookup addon
      await lookup(interaction);
    }
    // If subcommand is about
    else if (interaction.options.getSubcommand() === 'about') {
      // Execute about addon
      await about(interaction);
    }
    // If subcommand is stats
    else if (interaction.options.getSubcommand() === 'stats') {
      // Execute stats addon
      await stats(interaction);
    }
  },
};

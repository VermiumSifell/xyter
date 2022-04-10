// Dependencies
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Modules
import lookup from './modules/lookup';
import about from './modules/about';
import stats from './modules/stats';

// Handlers
import logger from '../../handlers/logger';

// Function
export default {
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
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options, guild, user, commandName } = interaction;

    // Module - Lookup
    if (options?.getSubcommand() === 'lookup') {
      // Execute Module - Lookup
      return lookup(interaction);
    }
    // Module - About
    else if (options?.getSubcommand() === 'about') {
      // Execute Module - About
      return about(interaction);
    }
    // Module - Stats
    else if (options?.getSubcommand() === 'stats') {
      // Execute Module - Stats
      return stats(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

// Dependencies
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Modules
import view from './modules/view';

// Function
export default {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Check a profile.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('view')
        .setDescription('View a profile.')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('The profile you wish to view')
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Module - View
    if (interaction.options.getSubcommand() === 'view') {
      // Execute Module - View
      await view(interaction);
    }
  },
};

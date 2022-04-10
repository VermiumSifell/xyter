// Dependencies
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// Modules
import give from './modules/give';

// Function
export default {
  data: new SlashCommandBuilder()
    .setName('reputation')
    .setDescription('Give reputation.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('give')
        .setDescription('Give reputation to a user')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('The user you want to repute.')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('What type of reputation you want to repute')
            .setRequired(true)
            .addChoice('Positive', 'positive')
            .addChoice('Negative', 'negative')
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options } = interaction;

    // Module - Give
    if (options.getSubcommand() === 'give') {
      // Execute Module - Give
      await give(interaction);
    }
  },
};

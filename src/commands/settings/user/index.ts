// Dependencies
import { CommandInteraction } from 'discord.js';

// Handlers
import logger from '../../../handlers/logger';

// Modules
import appearance from './modules/appearance';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user, options, commandName } = interaction;

  // Module - Appearance
  if (options?.getSubcommand() === 'appearance') {
    // Execute Module - Appearance
    await appearance(interaction);
  }

  // Send debug message
  return logger?.debug(
    `Guild: ${guild?.id} User: ${
      user?.id
    } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
  );
};

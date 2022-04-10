// Dependencies
import { CommandInteraction } from 'discord.js';

// Modules
import give from './modules/give';
import take from './modules/take';
import set from './modules/set';
import transfer from './modules/transfer';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options } = interaction;

  // Module - Give
  if (options?.getSubcommand() === 'give') {
    // Execute Module - Give
    return give(interaction);
  }

  // Module - Take
  else if (options?.getSubcommand() === 'take') {
    // Execute Module - Take
    return take(interaction);
  }

  // Module - Set
  else if (options?.getSubcommand() === 'set') {
    // Execute Module - Set
    return set(interaction);
  }

  // Module - Transfer
  else if (options?.getSubcommand() === 'transfer') {
    // Execute Module - Transfer
    return transfer(interaction);
  }
};

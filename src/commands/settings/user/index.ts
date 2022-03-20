import { Permissions } from 'discord.js';
import config from '../../../../config.json';
import logger from '../../../handlers/logger';
import { appearance } from './addons';

export default async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // If subcommand is appearance
  if (interaction.options.getSubcommand() === 'appearance') {
    // Execute appearance addon
    await appearance(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};

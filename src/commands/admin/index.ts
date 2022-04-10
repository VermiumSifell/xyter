//Dependencies
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ColorResolvable, Permissions } from 'discord.js';

// Configurations
import config from '../../../config.json';

// Handlers
import logger from '../../handlers/logger';

// Groups
import credits from './credits';
import counters from './counters';

// Function
export default {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin actions.')
    .addSubcommandGroup((group) =>
      group
        .setName('credits')
        .setDescription('Manage credits.')
        .addSubcommand((command) =>
          command
            .setName('give')
            .setDescription('Give credits to a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to pay.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will pay.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('set')
            .setDescription('Set credits to a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to set credits on.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will set.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('take')
            .setDescription('Take credits from a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to take credits from.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will take.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('transfer')
            .setDescription('Transfer credits from a user to another user.')
            .addUserOption((option) =>
              option
                .setName('from')
                .setDescription('The user you want to take credits from.')
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName('to')
                .setDescription('The user you want to give credits to.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will transfer.')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('counters')
        .setDescription('Manage counters.')
        .addSubcommand((command) =>
          command
            .setName('add')
            .setDescription('Add a counter')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('The counter channel.')
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName('word')
                .setDescription('The counter word.')
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option.setName('start').setDescription('Start at number X.')
            )
        )
        .addSubcommand((command) =>
          command
            .setName('remove')
            .setDescription('Remove a counter')
            .addChannelOption((option) =>
              option
                .setName('channel')
                .setDescription('The counter channel.')
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { memberPermissions, options, user, commandName, guild } =
      interaction;

    // Check permission
    if (!memberPermissions?.has(Permissions?.FLAGS?.MANAGE_GUILD)) {
      // Embed object
      const embed = {
        title: ':toolbox: Admin' as string,
        color: config?.colors?.error as ColorResolvable,
        description: 'You do not have permission to manage this!' as string,
        timestamp: new Date(),
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    }

    // Group - Credits
    if (options?.getSubcommandGroup() === 'credits') {
      // Execute Group - Credits
      return credits(interaction);
    }

    // Group - Counters
    else if (options?.getSubcommandGroup() === 'counters') {
      // Execute Group - Counters
      return counters(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

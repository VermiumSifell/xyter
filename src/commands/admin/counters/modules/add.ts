// Dependencies
import { ColorResolvable, CommandInteraction } from 'discord.js';

// Configurations
import config from '../../../../../config.json';

// Handlers
import logger from '../../../../handlers/logger';

// Models
import counterSchema from '../../../../helpers/database/models/counterSchema';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, guild, user } = interaction;

  // Channel option
  const optionChannel = options?.getChannel('channel');

  // Word option
  const optionWord = options?.getString('word');

  // Start option
  const optionStart = options?.getNumber('start');

  if (optionChannel?.type !== 'GUILD_TEXT') {
    // Return interaction reply
    return interaction?.editReply({
      embeds: [
        {
          title: ':toolbox: Admin - Counters [Add]' as string,
          description:
            'That channel is not supported, it needs to be a text channel.' as string,
          timestamp: new Date(),
          color: config?.colors?.error as ColorResolvable,
          footer: {
            iconURL: config?.footer?.icon as string,
            text: config?.footer?.text as string,
          },
        },
      ],
    });
  }

  const counterExist = await counterSchema?.findOne({
    guildId: guild?.id,
    channelId: optionChannel?.id,
    optionWord,
  });

  if (!counterExist) {
    await counterSchema?.create({
      guildId: guild?.id,
      channelId: optionChannel?.id,
      optionWord,
      counter: optionStart || 0,
    });

    // Log debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} added ${optionChannel?.id} as a counter using word "${optionWord}" for counting.`
    );

    // Return interaction reply
    return interaction?.editReply({
      embeds: [
        {
          title: ':toolbox: Admin - Counters [Add]' as string,
          description: `${optionChannel} is now counting when hearing word ${optionWord} and it starts at number ${
            optionStart || 0
          }.`,
          timestamp: new Date(),
          color: config?.colors?.success as ColorResolvable,
          footer: {
            iconURL: config?.footer?.icon as string,
            text: config?.footer?.text as string,
          },
        },
      ],
    });
  }

  // Return interaction reply
  return interaction?.editReply({
    embeds: [
      {
        title: ':toolbox: Admin - Counters [Add]' as string,
        description: `${optionChannel} is already a counting channel.`,
        timestamp: new Date(),
        color: config?.colors?.error as ColorResolvable,
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      },
    ],
  });
};

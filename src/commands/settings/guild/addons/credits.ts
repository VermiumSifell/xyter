// Dependencies
import { ColorResolvable, CommandInteraction } from 'discord.js';

// Configurations
import config from '../../../../../config.json';

//Handlers
import logger from '../../../../handlers/logger';

// Models
import guildSchema from '../../../../helpers/database/models/guildSchema';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user, options } = interaction;

  // Get options
  const status = options?.getBoolean('status');
  const rate = options?.getNumber('rate');
  const timeout = options?.getNumber('timeout');
  const minimumLength = options?.getNumber('minimum-length');
  const workRate = options?.getNumber('work-rate');
  const workTimeout = options?.getNumber('work-timeout');

  // Get guild object
  const guildDB = await guildSchema?.findOne({
    guildId: guild?.id,
  });

  // Modify values
  guildDB.credits.status = status !== null ? status : guildDB?.credits?.status;
  guildDB.credits.rate = rate !== null ? rate : guildDB?.credits?.rate;
  guildDB.credits.timeout =
    timeout !== null ? timeout : guildDB?.credits?.timeout;
  guildDB.credits.workRate =
    workRate !== null ? workRate : guildDB?.credits?.workRate;
  guildDB.credits.workTimeout =
    workTimeout !== null ? workTimeout : guildDB?.credits?.workTimeout;
  guildDB.credits.minimumLength =
    minimumLength !== null ? minimumLength : guildDB?.credits?.minimumLength;

  // Save guild
  await guildDB?.save()?.then(async () => {
    // Embed object
    const embed = {
      title: ':tools: Settings - Guild [Credits]' as string,
      description: 'Following settings is set!' as string,
      color: config?.colors?.success as ColorResolvable,
      fields: [
        {
          name: '🤖 Status' as string,
          value: `${guildDB?.credits?.status}` as string,
          inline: true,
        },
        {
          name: '📈 Rate' as string,
          value: `${guildDB?.credits?.rate}` as string,
          inline: true,
        },
        {
          name: '📈 Work Rate' as string,
          value: `${guildDB?.credits?.workRate}` as string,
          inline: true,
        },
        {
          name: '🔨 Minimum Length' as string,
          value: `${guildDB?.credits?.minimumLength}` as string,
          inline: true,
        },
        {
          name: '⏰ Timeout' as string,
          value: `${guildDB?.credits?.timeout}` as string,
          inline: true,
        },
        {
          name: '⏰ Work Timeout' as string,
          value: `${guildDB?.credits?.workTimeout}` as string,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user.id} has changed credit details.`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  });
};

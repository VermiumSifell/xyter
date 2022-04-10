// Dependencies
import { CommandInteraction, ColorResolvable } from 'discord.js';
import Chance from 'chance';

// Configurations
import config from '../../../../config.json';

// Handlers
import logger from '../../../handlers/logger';

// Models
import guildSchema from '../../../helpers/database/models/guildSchema';
import userSchema from '../../../helpers/database/models/userSchema';
import timeouts from '../../../helpers/database/models/timeoutSchema';

// Helpers
import creditNoun from '../../../helpers/creditNoun';

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user } = interaction;

  // Chance module
  const chance = new Chance();

  // Check if user has a timeout
  const isTimeout = await timeouts?.findOne({
    guildId: guild?.id,
    userId: user?.id,
    timeoutId: '2022-03-15-19-16',
  });

  const guildDB = await guildSchema?.findOne({
    guildId: guild?.id,
  });

  // If user is not on timeout
  if (!isTimeout) {
    const creditsEarned = chance.integer({
      min: 0,
      max: guildDB?.credits?.workRate,
    });

    const userDB = await userSchema?.findOne({
      userId: user?.id,
      guildId: guild?.id,
    });

    userDB.credits += creditsEarned;

    await userDB?.save()?.then(async () => {
      // Send debug message
      logger?.debug(`Credits added to user: ${user?.id}`);

      // Create embed object
      const embed = {
        title: ':dollar: Credits [Work]' as string,
        description: `You have earned ${creditNoun(creditsEarned)}` as string,
        color: config?.colors?.success as ColorResolvable,
        timestamp: new Date() as Date,
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Send interaction reply
      return await interaction?.editReply({ embeds: [embed] });
    });

    // Create a timeout for the user
    await timeouts?.create({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: '2022-03-15-19-16',
    });

    setTimeout(async () => {
      // Send debug message
      logger?.debug(
        `Guild: ${guild?.id} User: ${user?.id} has not worked within the last ${
          guildDB?.work?.timeout / 1000
        } seconds, work can be done`
      );

      // When timeout is out, remove it from the database
      await timeouts?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: '2022-03-15-19-16',
      });
    }, guildDB?.credits?.workTimeout);
  } else {
    // Create embed object
    const embed = {
      title: ':dollar: Credits [Work]' as string,
      description: `You have worked within the last ${
        guildDB?.credits?.workTimeout / 1000
      } seconds, you can not work now!` as string,
      timestamp: new Date() as Date,
      color: config?.colors?.error as ColorResolvable,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} has worked within last day, no work can be done`
    );

    // Return interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }
};

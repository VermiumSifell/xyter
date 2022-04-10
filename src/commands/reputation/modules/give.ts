import i18next from 'i18next';
import { CommandInteraction } from 'discord.js';
import config from '../../../../config.json';
import logger from '../../../handlers/logger';
import users from '../../../helpers/database/models/userSchema';
import timeouts from '../../../helpers/database/models/timeoutSchema';

export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, user, guild } = interaction;

  // Target information
  const target = options.getUser('target');

  // Type information
  const type = options.getString('type');

  // User information
  const userObj = await users.findOne({
    userId: user?.id,
    guildId: guild?.id,
  });

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: guild?.id,
    userId: user?.id,
    timeoutId: 2,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Do not allow self reputation
    if (target?.id === user?.id) {
      // Embed object
      const embed = {
        title: ':loudspeaker: Reputation - Give',
        description: 'You can not repute yourself.',
        timestamp: new Date(),
        color: config.colors.error as any,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Return interaction reply
      return interaction.editReply({ embeds: [embed] });
    }

    // If type is positive
    if (type === 'positive') {
      userObj.reputation += 1;
    }

    // If type is negative
    if (type === 'negative') {
      userObj.reputation -= 1;
    }

    // Save user
    await userObj.save().then(async () => {
      // Embed object
      const embed = {
        title: ':loudspeaker: Reputation - Give',
        description: `You have given ${target} a ${type} reputation!`,
        timestamp: new Date(),
        color: config.colors.success as any,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Log debug message
      logger.debug(
        `Guild: ${guild?.id} User: ${user?.id} has given ${target?.id} a ${type} reputation.`
      );

      // Create a timeout for the user
      await timeouts.create({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: 2,
      });
    });

    setTimeout(async () => {
      // send debug message
      logger.debug(
        `Guild: ${guild?.id} User: ${user?.id} has not repute within last ${
          config.reputation.timeout / 1000
        } seconds, reputation can be given`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: 2,
      });
    }, config.reputation.timeout);
  } else {
    // Create embed object
    const embed = {
      title: ':loudspeaker: Reputation - Give',
      description: `You have given reputation within the last ${
        config.reputation.timeout / 1000
      } seconds, you can not repute now!`,
      timestamp: new Date(),
      color: config.colors.error as any,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Log debug message
    logger.debug(
      `Guild: ${guild?.id} User: ${user?.id} has repute within last ${
        config.reputation.timeout / 1000
      } seconds, no reputation can be given`
    );
  }
};

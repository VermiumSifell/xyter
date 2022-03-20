import i18next from 'i18next';
import config from '../../../../config.json';
import logger from '../../../handlers/logger';
import { users, credits, experiences } from '../../../helpers/database/models';

export default async (interaction) => {
  try {
    // Destructure member
    const { member } = await interaction;
    const { guild } = member;

    // Get options
    const target = await interaction.options.getUser('target');

    // Get discord user object
    const discordUser = await interaction.client.users.fetch(
      `${target ? target.id : member.id}`
    );

    // Get user object
    const userDB = await users.findOne({
      userId: await discordUser.id,
      guildId: guild.id,
    });

    // Create embed object
    const embed = {
      author: {
        name: `${await discordUser.username}#${await discordUser.discriminator}`,
        icon_url: await discordUser.displayAvatarURL(),
      },
      color: config.colors.success,
      fields: [
        {
          name: `:dollar: Credits`,
          value: `${userDB.credits || 'Not found'}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Level`,
          value: `${userDB.level || 'Not found'}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Points`,
          value: `${userDB.points || 'Not found'}`,
          inline: true,
        },
        {
          name: `:loudspeaker: Reputation`,
          value: `${userDB.reputation || 'Not found'}`,
          inline: true,
        },
        {
          name: `:rainbow_flag: Language`,
          value: `${userDB.language || 'Not found'}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

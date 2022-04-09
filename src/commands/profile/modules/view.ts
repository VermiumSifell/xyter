import i18next from 'i18next';
import config from '../../../../config.json';
import logger from '../../../handlers/logger';
import users from '../../../helpers/database/models/userSchema';
import { CommandInteraction } from 'discord.js';
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { client, options, user, guild } = interaction;

  // Target information
  const target = options?.getUser('target');

  // Discord User Information
  const discordUser = await client.users.fetch(
    `${target ? target?.id : user?.id}`
  );

  // User Information
  const userObj = await users.findOne({
    userId: discordUser?.id,
    guildId: guild?.id,
  });

  // Embed object
  const embed = {
    author: {
      name: `${discordUser.username}#${discordUser.discriminator}`,
      icon_url: discordUser.displayAvatarURL(),
    },
    color: config.colors.success as any,
    fields: [
      {
        name: `:dollar: Credits`,
        value: `${userObj.credits || 'Not found'}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Level`,
        value: `${userObj.level || 'Not found'}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Points`,
        value: `${userObj.points || 'Not found'}`,
        inline: true,
      },
      {
        name: `:loudspeaker: Reputation`,
        value: `${userObj.reputation || 'Not found'}`,
        inline: true,
      },
      {
        name: `:rainbow_flag: Language`,
        value: `${userObj.language || 'Not found'}`,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send interaction reply
  return await interaction.editReply({ embeds: [embed] });
};

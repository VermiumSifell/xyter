const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const {
  users,
  credits,
  experiences,
} = require('../../../helpers/database/models');

module.exports = async (interaction) => {
  try {
    // Destructure member
    const { member } = await interaction;

    // Get options
    const target = await interaction.options.getUser('target');

    // Get discord user object
    const discordUser = await interaction.client.users.fetch(
      `${target ? target.id : member.id}`
    );

    // Get user object
    const user = await users.findOne({ userId: await discordUser.id });

    // Get experience object
    const experience = await experiences.findOne({
      userId: await discordUser.id,
      guildId: await member.guild.id,
    });

    // Get credit object
    const credit = await credits.findOne({
      userId: await discordUser.id,
      guildId: await member.guild.id,
    });

    // If any of the objects return is null
    if (user === null || experience === null || credit === null) {
      // Create embed object
      const embed = {
        title: 'Profile',
        description: `${
          target || 'You'
        } have to write something before viewing ${
          target ? 'their' : 'your'
        } profile!`,
        timestamp: new Date(),
        color: config.colors.error,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed] });
    }

    // Language variables
    const notAvailableText = i18next.t('general:not_available', {
      lng: await user.language,
    });
    const reputationText = i18next.t(
      'commands:profile:addons:view:embed:reputation',
      {
        lng: await user.language,
      }
    );
    const levelText = i18next.t('commands:profile:addons:view:embed:level', {
      lng: await user.language,
    });
    const pointsText = i18next.t('commands:profile:addons:view:embed:points', {
      lng: await user.language,
    });
    const creditsText = i18next.t(
      'commands:profile:addons:view:embed:credits',
      {
        lng: await user.language,
      }
    );
    const languageCodeText = i18next.t(
      'commands:profile:addons:view:embed:language_code',
      {
        lng: await user.language,
      }
    );

    // Create embed object
    const embed = {
      author: {
        name: `${await discordUser.username}#${await discordUser.discriminator}`,
        icon_url: await discordUser.displayAvatarURL(),
      },
      color: config.colors.success,
      fields: [
        {
          name: `:money_with_wings: ${creditsText}`,
          value: `${(await credit.balance) || `${notAvailableText}`}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: ${levelText}`,
          value: `${(await experience.level) || `${notAvailableText}`}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: ${pointsText}`,
          value: `${(await experience.points) || `${notAvailableText}`}`,
          inline: true,
        },
        {
          name: `:loudspeaker: ${reputationText}`,
          value: `${(await user.reputation) || `${notAvailableText}`}`,
          inline: true,
        },
        {
          name: `:rainbow_flag: ${languageCodeText}`,
          value: `${(await user.language) || `${notAvailableText}`}`,
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

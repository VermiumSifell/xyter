const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { credits, apis } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Needs to be made multi-guild
  if (config.disable.redeem) {
    // Create embed object
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl failed',
      description: 'This item in the shop is currently disabled.',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options
  const amount = await interaction.options.getInteger('amount');

  // Get user object
  const user = await credits.findOne({
    userId: interaction.user.id,
    guildId: interaction.member.guild.id,
  });

  // Get DM user object
  const dmUser = interaction.client.users.cache.get(interaction.member.user.id);

  // Stop if amount or user balance is below 100
  if ((amount || user.balance) < 100) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You **can't** withdraw for __Pterodactyl__ below **100**.`,
      color: config.colors.error,
      fields: [{ name: 'Your balance', value: `${creditNoun(user.balance)}` }],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Stop if amount or user balance is above 1.000.000
  if ((amount || user.balance) > 1000000) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You **can't** withdraw for __Pterodactyl__ above **1.000.000**.`,
      color: config.colors.error,
      fields: [{ name: 'Your balance', value: `${creditNoun(user.balance)}` }],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Stop if user balance is below amount
  if (user.balance < amount) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You have **insufficient** credits.`,
      color: config.colors.error,
      fields: [{ name: 'Your balance', value: `${creditNoun(user.balance)}` }],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Generate a unique voucher for the user
  const code = uuidv4();

  // Get api object
  const apiCredentials = await apis.findOne({
    guildId: interaction.member.guild.id,
  });

  // Create a api instance
  const api = axios.create({
    baseURL: apiCredentials.url,
    headers: { Authorization: `Bearer ${apiCredentials.token}` },
  });

  // Get shop URL
  const shopUrl = apiCredentials.url.replace('/api', '/store');

  // Make API request
  await api

    // Make a post request to the API
    .post('vouchers', {
      uses: 1,
      code,
      credits: amount || user.balance,
      memo: `${interaction.createdTimestamp} - ${interaction.user.id}`,
    })

    // If successful
    .then(async () => {
      // Create DM embed object
      const dmEmbed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: `Redeem this voucher [here](${shopUrl})!`,
        fields: [
          { name: 'Code', value: `${code}`, inline: true },
          {
            name: 'Credits',
            value: `${amount || user.balance}`,
            inline: true,
          },
        ],
        color: config.colors.success,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Create interaction embed object
      const interactionEmbed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: 'I have sent you the code in DM!',
        color: config.colors.success,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Withdraw amount from user balance
      user.balance -= amount || user.balance;

      // Save new balance
      await user
        .save()
        // If successful
        .then(async () => {
          // Send debug message
          await logger.debug(
            `User: ${user.username} redeemed: ${creditNoun(amount)}`
          );

          // Send DM message
          await dmUser.send({ embeds: [dmEmbed] });

          // Send interaction reply
          await interaction.editReply({
            embeds: [interactionEmbed],
            ephemeral: true,
          });
        })

        // If error occurs
        .catch(async (e) => {
          await logger.error(e);
          const embed = {
            title: ':shopping_cart: Shop - Pterodactyl',
            description: 'Something went wrong, please try again later.',
            color: config.colors.error,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    })

    // If error occurs
    .catch(async (e) => {
      await logger.error(e);
      const embed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: 'Something went wrong, please try again later.',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });
};

const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { credits } = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');
const saveUser = require('../../../../helpers/saveUser');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: 'Admin',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options
  const from = await interaction.options.getUser('from');
  const to = await interaction.options.getUser('to');
  const amount = await interaction.options.getInteger('amount');

  // Get fromUser object
  const fromUser = await credits.findOne({
    userId: from.id,
    guildId: interaction.member.guild.id,
  });

  // Get toUser object
  const toUser = await credits.findOne({
    userId: to.id,
    guildId: interaction.member.guild.id,
  });

  // If fromUser has no credits
  if (!fromUser) {
    // Create embed object
    const embed = {
      title: 'Transfer',
      description:
        'That user has no credits, I can not transfer credits from the user',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If toUser has no credits
  if (!toUser) {
    // Create embed object
    const embed = {
      title: 'Transfer',
      description:
        'That user has no credits, I can not transfer credits to the user',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If amount is zero or below
  if (amount <= 0) {
    // Create embed object
    const embed = {
      title: 'Transfer failed',
      description: "You can't transfer zero or below.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Withdraw amount from fromUser
  fromUser.balance -= amount;

  // Deposit amount to toUser
  toUser.balance += amount;

  // Save users
  await saveUser(fromUser, toUser)
    // If successful
    .then(async () => {
      // Create embed object
      const embed = {
        title: 'Transfer',
        description: `You sent ${creditNoun(amount)} from ${from} to ${to}.`,
        color: 0x22bb33,
        fields: [
          {
            name: `${from.username} Balance`,
            value: `${fromUser.balance}`,
            inline: true,
          },
          {
            name: `${to.username} Balance`,
            value: `${toUser.balance}`,
            inline: true,
          },
        ],
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      await interaction.editReply({ embeds: [embed], ephemeral: true });

      // Send debug message
      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} transferred ${creditNoun(
          amount
        )} from ${from.id} to ${to.id}.`
      );
    });
};

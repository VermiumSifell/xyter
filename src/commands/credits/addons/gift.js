const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const saveUser = require('../../../helpers/saveUser');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    // Get options
    const user = await interaction.options.getUser('user');
    const amount = await interaction.options.getInteger('amount');
    const reason = await interaction.options.getString('reason');

    // Get data object
    const data = await credits.findOne({
      userId: interaction.user.id,
      guildId: interaction.member.guild.id,
    });

    // If receiver is same as sender
    if (user.id === interaction.user.id) {
      // Create embed object
      const embed = {
        title: 'Gift',
        description: "You can't pay yourself.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // If amount is zero or below
    if (amount <= 0) {
      // Create embed object
      const embed = {
        title: 'Gift',
        description: "You can't pay zero or below.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // If user has below gifting amount
    if (data.balance < amount) {
      // Create embed
      const embed = {
        title: 'Gift',
        description: `You have insufficient credits. Your balance is ${data.balance}`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // Get fromUser object
    const fromUser = await credits.findOne({
      userId: interaction.user.id,
      guildId: interaction.member.guild.id,
    });

    // Get toUser object
    const toUser = await credits.findOne({
      userId: user.id,
      guildId: interaction.member.guild.id,
    });

    // If toUser has no credits
    if (!toUser) {
      // Create embed object
      const embed = {
        title: 'Gift',
        description:
          'That user has no credits, I can not gift credits to the user',
        color: config.colors.error,
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
    await saveUser(fromUser, toUser).then(async () => {
      // Create interaction embed object
      const interactionEmbed = {
        title: 'Gift',
        description: `You sent ${creditNoun(amount)} to ${user}${
          reason ? ` with reason: ${reason}` : ''
        }. Your new balance is ${creditNoun(fromUser.balance)}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Create DM embed object
      const dmEmbed = {
        title: 'Gift',
        description: `You received ${creditNoun(amount)} from ${
          interaction.user
        }${
          reason ? ` with reason: ${reason}` : ''
        }. Your new balance is ${creditNoun(toUser.balance)}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Get DM user object
      const dmUser = await interaction.client.users.cache.get(user.id);

      // Send DM to user
      await dmUser.send({ embeds: [dmEmbed] });

      // Send debug message
      await logger.debug(
        `Gift sent from: ${interaction.user.username} to: ${user.username}`
      );

      // Send interaction reply
      return await interaction.editReply({
        embeds: [interactionEmbed],
        ephemeral: true,
      });
    });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

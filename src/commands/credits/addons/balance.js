const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    // Get options
    const user = await interaction.options.getUser('user');

    // Get credit object
    await credits
      .findOne({
        userId: user ? user.id : interaction.user.id,
        guildId: interaction.member.guild.id,
      })

      // If successful
      .then(async (data) => {
        // If user has no credits
        if (!data) {
          // Create embed object
          const embed = {
            title: 'Balance',
            description: `${user} has no credits.`,
            color: config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };

          // Send interaction reply
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        // Destructure balance
        const { balance } = data;

        // Create embed object
        const embed = {
          title: 'Balance',
          description: `${user ? `${user} has` : 'You have'} ${creditNoun(
            balance
          )}.`,
          color: config.colors.success,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };

        // Send interaction reply
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      })
      .catch(async (e) => {
        // Send debug message
        await logger.error(e);
      });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

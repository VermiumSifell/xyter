const config = require('../../../../config.json');
const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Get all users in the guild
  await credits
    .find({ guildId: interaction.member.guild.id })

    // If successful
    .then(async (data) => {
      // Get top ten
      const topTen = data

        // Sort them after balance amount (ascending)
        .sort((a, b) => (a.balance > b.balance ? -1 : 1))

        // Return the top 10
        .slice(0, 10);

      // Create entry object
      const entry = (x, index) =>
        `**Top ${index + 1}** - <@${x.userId}> ${creditNoun(x.balance)}`;

      // Create embed object
      const embed = {
        title: 'Balance Top',
        description: `Below are the top ten.\n${topTen
          .map((x, index) => entry(x, index))
          .join('\n')}`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });
};

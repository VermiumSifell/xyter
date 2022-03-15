const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');
const {
  guilds,
  credits,
  timeouts,
} = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: member.guild.id,
    userId: member.id,
    timeoutId: 3,
  });

  const guild = await guilds.findOne({
    guildId: member.guild.id,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Make a variable of how much credits user will earn based on random multiplied with work rate
    const creditsEarned = Math.floor(Math.random() * guild.credits.workRate);

    // Add credits to user
    await credits
      .findOneAndUpdate(
        {
          userId: interaction.member.id,
          guildId: interaction.member.guild.id,
        },
        { $inc: { balance: creditsEarned } },
        { new: true, upsert: true }
      )

      // If successful
      .then(async () => {
        // Send debug message
        logger.debug(`Credits added to user: ${interaction.member.id}`);

        // Create embed object
        const embed = {
          title: 'Work',
          description: `You earned ${creditNoun(creditsEarned)}`,
          color: config.colors.success,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };

        // Send interaction reply
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      });

    // Create a timeout for the user
    await timeouts.create({
      guildId: member.guild.id,
      userId: member.id,
      timeoutId: 3,
    });

    setTimeout(async () => {
      // Send debug message
      await logger.debug(
        `Guild: ${member.guild.id} User: ${
          member.id
        } has not worked within the last ${
          guild.work.timeout / 1000
        } seconds, work can be done`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 3,
      });
    }, 86400000);
  } else {
    // Create embed object
    const embed = {
      title: 'Work',
      description: `You have worked within the last ${
        guild.credits.workTimeout / 1000
      } seconds, you can not work now!`,
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} has worked within last day, no work can be done`
    );
  }
};

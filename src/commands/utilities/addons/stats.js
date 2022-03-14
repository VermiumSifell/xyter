const config = require('../../../../config.json');

module.exports = async (interaction) => {
  let totalSeconds = interaction.client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

  const interactionEmbed = {
    title: ':hammer: Utilities - Stats',
    description: 'Below you can see a list of statistics about the bot.',
    fields: [
      {
        name: '⏰ Latency',
        value: `${Date.now() - interaction.createdTimestamp} ms`,
        inline: true,
      },
      {
        name: '⏰ API Latency',
        value: `${Math.round(interaction.client.ws.ping)} ms`,
        inline: true,
      },
      {
        name: '⏰ Uptime',
        value: `${uptime}`,
        inline: false,
      },
      {
        name: '📈 Guilds',
        value: `${interaction.client.guilds.cache.size}`,
        inline: true,
      },
      {
        name: '📈 Users (non-unique)',
        value: `${interaction.client.guilds.cache.reduce(
          (acc, guild) => acc + guild.memberCount,
          0
        )}`,
        inline: true,
      },
    ],
    color: config.colors.success,
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };
  interaction.editReply({ embeds: [interactionEmbed], ephemeral: true });
};

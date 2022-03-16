const { dbGuildFix } = require('../helpers');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    // Destructure client
    const { client } = guild;

    await dbGuildFix(guild);

    // Set client status
    await client.user.setPresence({
      activities: [
        { type: 'WATCHING', name: `${client.guilds.cache.size} guilds` },
      ],
      status: 'online',
    });
  },
};

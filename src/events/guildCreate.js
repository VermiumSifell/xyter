const { guilds, apis } = require('../helpers/database/models');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    // Destructure client
    const { client } = guild;

    // Create guild object if not already created
    const guildExist = await guilds.findOne({ guildId: guild.id });
    if (!guildExist) {
      await guilds.create({ guildId: guild.id });
    }

    const apiExist = await apis.findOne({ guildId: guild.id });

    if (!apiExist) {
      apis.create({ guildId: guild.id });
    }

    // Set client status
    await client.user.setPresence({
      activities: [
        { type: 'WATCHING', name: `${client.guilds.cache.size} guilds` },
      ],
      status: 'online',
    });
  },
};

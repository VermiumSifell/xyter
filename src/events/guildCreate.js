const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    // Destructure client
    const { client } = guild;

    // Create guild object if not already created
    await guilds.findOne({ guildId: guild.id }, { new: true, upsert: true });

    // Set client status
    await client.user.setPresence({
      activities: [
        { type: 'WATCHING', name: `${client.guilds.cache.size} guilds` },
      ],
      status: 'online',
    });
  },
};

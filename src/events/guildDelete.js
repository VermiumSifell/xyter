const {
  guilds,
  users,
  apis,
  counters,
  shopRoles,
  timeouts,
} = require('../helpers/database/models');

const logger = require('../handlers/logger');

module.exports = {
  name: 'guildDelete',
  async execute(guild) {
    // Destructure client
    const { client } = guild;

    guilds
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(`Successfully deleted guild: ${guild.id}`);
      })
      .catch(async (e) => {
        await logger.error(`Failed to delete guild: ${guild.id} ${e}`);
      });
    users
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(`Successfully deleted guild: ${guild.id}'s users`);
      })
      .catch(async (e) => {
        await logger.error(`Failed to delete guild: ${guild.id}'s users ${e}`);
      });
    apis
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(`Successfully deleted guild: ${guild.id}'s apis`);
      })
      .catch(async (e) => {
        await logger.error(`Failed to delete guild: ${guild.id}'s apis ${e}`);
      });
    counters
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(
          `Successfully deleted guild: ${guild.id}'s counters`
        );
      })
      .catch(async (e) => {
        await logger.error(
          `Failed to delete guild: ${guild.id}'s counters ${e}`
        );
      });
    shopRoles
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(
          `Successfully deleted guild: ${guild.id}'s shop roles`
        );
      })
      .catch(async (e) => {
        await logger.error(
          `Failed to delete guild: ${guild.id}'s shop roles ${e}`
        );
      });
    timeouts
      .deleteMany({ guildId: guild.id })
      .then(async () => {
        await logger.debug(
          `Successfully deleted guild: ${guild.id}'s timeouts`
        );
      })
      .catch(async (e) => {
        await logger.error(
          `Failed to delete guild: ${guild.id}'s timeouts ${e}`
        );
      });

    // Set client status
    await client.user.setPresence({
      activities: [
        { type: 'WATCHING', name: `${client.guilds.cache.size} guilds` },
      ],
      status: 'online',
    });
  },
};

const schedule = require('node-schedule');
const { shopRoles, credits, guilds } = require('../helpers/database/models');
const logger = require('./logger');

module.exports = async (client) => {
  // schedule.scheduleJob('*/1 * * *', function () {
  //   console.log('The answer to life, the universe, and everything!');
  // });

  schedule.scheduleJob('*/30 * * * *', async () => {
    shopRoles.find().then(async (data) => {
      data.map(async (role) => {
        const payed = new Date(role.lastPayed);

        oneHourAfterPayed = payed.setHours(payed.getHours() + 1);

        if (new Date() > oneHourAfterPayed) {
          // Get guild object
          const guild = await guilds.findOne({
            guildId: role.guildId,
          });

          const userObject = await credits.findOne({
            userId: role.userId,
            guildId: role.guildId,
          });
          const { pricePerHour } = guild.shop.roles;

          if (userObject.balance < pricePerHour) {
            const rGuild = await client.guilds.cache.get(`${role.guildId}`);
            const rMember = await rGuild.members.fetch(`${role.userId}`);

            await rMember.roles
              .remove(`${role.roleId}`)
              .then(console.log)
              .catch(console.error); // Removes all roles
          }

          role.lastPayed = new Date();
          role.save();
          userObject.balance -= pricePerHour;
          userObject.save();
          await logger.debug(
            `${role.roleId} was payed one hour later. BEFORE: ${payed} AFTER: ${oneHourAfterPayed} UPDATED: ${role.updatedAt} CREATED: ${role.createdAt}`
          );
        }
      });
    });

    await logger.debug('Checking schedules! (Every 30 minutes)');
  });
};

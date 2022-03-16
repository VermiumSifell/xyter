const { users } = require('./database/models');
const logger = require('../handlers/logger');

module.exports = async (user, guild) => {
  const userData = await users.findOne({ userId: user.id, guildId: guild.id });
  if (!userData) {
    users
      .create({ userId: user.id, guildId: guild.id })
      .then(async () => {
        await logger.debug(`User: ${user.id} added user collection`);
      })
      .catch(async (e) => {
        await logger.error(
          `User: ${user.id} failed to added user collection ${e}`
        );
      });
  } else {
    logger.debug(`User: ${user.id} already in user collection`);
  }

  // HOW TO ITERATE
  //
  // const guilds = client.guilds.cache;
  // await guilds.map(async (guild) => {
  //   await guild.members.fetch().then(async (members) => {
  //     await members.forEach(async (member) => {
  //       const { user } = member;
  //       dbMemberFix(user, guild);
  //     });
  //   });
  //   await dbGuildFix(guild);
  // });
};

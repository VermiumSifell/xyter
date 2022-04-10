import logger from '../../handlers/logger';
import config from '../../../config.json';
import deployCommands from '../../helpers/deployCommands';
import dbGuildFix from '../../helpers/dbGuildFix';
import dbMemberFix from '../../helpers/dbMemberFix';

import userSchema from '../../helpers/database/models/userSchema';

import { Client } from 'discord.js';
import updatePresence from '../../helpers/updatePresence';
export default {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    // Send info message
    await logger.info(`Ready! Logged in as ${client?.user?.tag}`);

    await updatePresence(client);

    if (config.importToDB) {
      const guilds = client.guilds.cache;
      await guilds.map(async (guild) => {
        await guild?.members.fetch().then(async (members) => {
          await members.forEach(async (member) => {
            const { user } = member;
            dbMemberFix(user, guild);
          });
        });
        await dbGuildFix(guild);
      });
    }

    if (config.clearUnused) {
      await userSchema.find().then(
        async (result) =>
          await result.map(async (user) => {
            if (
              user.credits !== 0 ||
              user.reputation !== 0 ||
              user.points !== 0
            ) {
              logger.info(`Not removing user: ${user}`);
            } else {
              logger.warn(`Removing user: ${user}`);
              console.log({ userId: user.userId, guildId: user.guildId });
              await userSchema
                .deleteOne({ _id: user._id })
                .then(async (result) => {
                  logger.error(`Removed user: ${user} ${result}`);
                });
            }
          })
      );
    }

    await deployCommands();
  },
};

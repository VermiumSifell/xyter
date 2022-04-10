// Dependencies
import { Guild } from 'discord.js';

// Models
import guildSchema from './database/models/guildSchema';

// Handlers
import logger from '../handlers/logger';

// Function
export default async (guild: Guild) => {
  const guildObj = await guildSchema?.findOne({ guildId: guild.id });
  if (guildObj === null) {
    const guildObj = new guildSchema({ guildId: guild.id });

    await guildObj
      .save()
      .then(async () => {
        logger.debug(
          `Guild: ${guild.id} has successfully been added to the database.`
        );
      })
      .catch(async (err: any) => {
        logger.error(err);
      });

    return guildObj;
  } else {
    return guildObj;
  }
};

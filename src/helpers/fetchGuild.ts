// Dependencies
import { Guild } from "discord.js";

// Models
import guildSchema from "../database/schemas/guild";

// Handlers
import logger from "../logger";

// Function
export default async (guild: Guild) => {
  const guildObj = await guildSchema?.findOne({ guildId: guild.id });
  if (guildObj === null) {
    const newGuildObj = new guildSchema({ guildId: guild.id });

    await newGuildObj
      .save()
      .then(async () => {
        logger.debug(
          `Guild: ${guild.id} has successfully been added to the database.`
        );
      })
      .catch(async (err: any) => {
        logger.error(err);
      });

    return newGuildObj;
  } else {
    return guildObj;
  }
};

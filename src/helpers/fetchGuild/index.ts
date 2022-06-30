// Dependencies
import { Snowflake } from "discord.js";

// Models
import guildSchema from "../../models/guild";

// Handlers
import logger from "../../logger";

// Function
export default async (id: Snowflake) => {
  const guildObj = await guildSchema?.findOne({ guildId: id });
  if (guildObj === null) {
    const newGuildObj = new guildSchema({ guildId: id });

    await newGuildObj
      .save()
      .then(async () => {
        logger?.silly(`Created guild: ${id}`);
      })
      .catch(async (error) => {
        logger?.error(`Error creating guild: ${id} - ${error}`);
      });

    return newGuildObj;
  } else {
    return guildObj;
  }
};

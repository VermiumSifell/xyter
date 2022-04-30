// 3rd party dependencies
import { Guild } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropGuild from "@helpers/dropGuild";
import logger from "@logger";

export default {
  async execute(guild: Guild) {
    const { client } = guild;

    logger?.verbose(`Deleted from guild: ${guild.name} (${guild.id})`);

    await dropGuild(guild);
    await updatePresence(client);

    logger.silly(`guildDelete: ${guild}`);
  },
};

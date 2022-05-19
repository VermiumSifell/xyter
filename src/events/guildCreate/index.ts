// 3rd party dependencies
import { Guild } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import fetchGuild from "@helpers/fetchGuild";
import logger from "@logger";

export default {
  async execute(guild: Guild) {
    const { client } = guild;

    logger?.verbose(`Added to guild: ${guild.name} (${guild.id})`);

    await fetchGuild(guild);
    await updatePresence(client);

    logger.silly(`guildCreate: ${guild}`);
  },
};

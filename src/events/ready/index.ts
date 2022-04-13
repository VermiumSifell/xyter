// Dependencies
import { Client } from "discord.js";
import logger from "../../logger";

// Helpers
import deployCommands from "../../handlers/deployCommands";
import updatePresence from "../../helpers/updatePresence";
import devMode from "../../helpers/devMode";

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    logger.info(`Successfully logged into discord user: ${client?.user?.tag}!`);
    await updatePresence(client);
    await devMode(client);
    await deployCommands();

    const guilds = client.guilds.cache;
    guilds.map(async (guild) => {
      logger.silly({ name: guild.name, members: guild.memberCount });
    });
  },
};

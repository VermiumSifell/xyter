// Dependencies
import { Client } from "discord.js";
import logger from "@logger";

// Helpers
import updatePresence from "@helpers/updatePresence";
import deployCommands from "@handlers/deployCommands";
import devMode from "@handlers/devMode";

export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    logger.info(`${client.user?.tag} (${client.user?.id}) is ready`);

    await updatePresence(client);
    await devMode(client);
    await deployCommands(client);

    client.guilds?.cache.forEach((guild) => {
      logger.verbose(
        `${client.user?.tag} (${client.user?.id}) is in guild: ${guild.name} (${guild.id}) with member count of ${guild.memberCount}`
      );
    });
  },
};

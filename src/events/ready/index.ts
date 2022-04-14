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
    logger?.info(`${client.user?.tag} (${client.user?.id}) is ready`);

    await updatePresence(client);
    await devMode(client);
    await deployCommands();

    client?.guilds?.cache?.forEach((guild) => {
      logger?.info(
        `${client.user?.tag} (${client.user?.id}) is in guild: ${guild.name} (${guild.id})`
      );
    });
  },
};

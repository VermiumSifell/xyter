// Dependencies
import { Client } from "discord.js";
import logger from "../../logger";

// Helpers
import updatePresence from "../../helpers/updatePresence";
import deployCommands from "../../handlers/deployCommands";
import devMode from "../../handlers/devMode";
import { IEventOptions } from "../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "once",
};

export const execute = async (client: Client) => {
  logger.info("Ready!");

  await updatePresence(client);
  await devMode(client);
  await deployCommands(client);

  client.guilds?.cache.forEach((guild) => {
    logger.silly(
      `${client.user?.tag} (${client.user?.id}) is in guild: ${guild.name} (${guild.id}) with member count of ${guild.memberCount}`
    );
  });
};

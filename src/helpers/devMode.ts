import logger from "../logger";
import config from "../../config.json";
import { Client } from "discord.js";

const { bot } = config;

export default async (client: Client) => {
  if (!config?.devMode) {
    client?.application?.commands
      ?.set([], config.bot.guildId)
      .then(async () => {
        logger.info(`Removed all guild based commands from ${bot.guildId}`);
      });
  }
};

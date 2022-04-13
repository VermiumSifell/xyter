import { devMode, bot } from "../../config.json";
import logger from "../logger";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async () => {
  const commands = [];
  const commandFiles = fs.readdirSync("./src/commands");

  for (const file of commandFiles) {
    // eslint-disable-next-line  global-require
    const command = require(`../commands/${file}`);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(bot?.token);

  await rest
    .put(Routes.applicationCommands(bot?.clientId), {
      body: commands,
    })
    .then(async () =>
      logger.info("Successfully registered application commands.")
    )
    .catch(async (error) => {
      logger.error(error);
    });

  if (devMode) {
    await rest
      .put(Routes.applicationGuildCommands(bot?.clientId, bot?.guildId), {
        body: commands,
      })
      .then(async () =>
        logger.info("Successfully registered guild application commands.")
      )
      .catch(async (error) => {
        logger.error(error);
      });
  }
};

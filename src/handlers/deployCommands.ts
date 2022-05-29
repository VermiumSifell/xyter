import { token, clientId } from "../config/discord";
import { devMode, guildId } from "../config/other";

import logger from "../logger";
import { ApplicationCommandDataResolvable, Client } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

import { ICommand } from "../interfaces/Command";

export default async (client: Client) => {
  const commandList: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  logger.info("Gathering command list");

  await Promise.all(
    client.commands.map(async (commandData: ICommand) => {
      commandList.push(commandData.builder.toJSON());

      logger.verbose(`${commandData.builder.name} pushed to list`);
    })
  )
    .then(async () => {
      logger.info(`Finished gathering command list.`);
    })
    .catch(async (error) => {
      logger.error(`${error}`);
    });

  const rest = new REST({ version: "9" }).setToken(token);

  await rest
    .put(Routes.applicationCommands(clientId), {
      body: commandList,
    })
    .then(async () => {
      logger.info(`Finished updating command list.`);
    })
    .catch(async (error) => {
      logger.error(`${error}`);
    });

  if (devMode) {
    await rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandList,
      })
      .then(async () => logger.info(`Finished updating guild command list.`))
      .catch(async (error) => {
        logger.error(`${error}`);
      });
  }
};

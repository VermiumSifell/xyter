// @ts-ignore
import { token, clientId } from "@config/discord";
// @ts-ignore
import { devMode, guildId } from "@config/other";

import logger from "../logger";
import { Client } from "@root/types/common/discord";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export default async (client: Client) => {
  const pluginList: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

  interface IPluginData {
    builder: SlashCommandBuilder;
  }

  await Promise.all(
    client.commands.map(async (pluginData: IPluginData) => {
      pluginList.push(pluginData.builder.toJSON());
      logger.verbose(
        `Plugin is ready for deployment: ${pluginData.builder.name}`
      );
    })
  )
    .then(async () => {
      logger.info("All plugins are ready to be deployed.");
    })
    .catch(async (error) => {
      logger.error(`${error}`);
    });

  const rest = new REST({ version: "9" }).setToken(token);

  await rest
    .put(Routes.applicationCommands(clientId), {
      body: pluginList,
    })
    .then(async () => {
      logger.info(`Successfully deployed plugins to Discord's API`);
    })
    .catch(async (error) => {
      logger.error(`${error}`);
    });

  if (devMode) {
    await rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: pluginList,
      })
      .then(async () =>
        logger.info(`Successfully deployed guild plugins to Discord's API`)
      )
      .catch(async (error) => {
        logger.error(`${error}`);
      });
  }
};

// Dependencies
import { token, clientId } from "@config/discord";
import { devMode, guildId } from "@config/other";

import logger from "../logger";
import { Client } from "@root/types/common/discord";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async (client: Client) => {
  const pluginList = [] as string[];

  await Promise.all(
    client.commands.map(async (pluginData: any) => {
      pluginList.push(pluginData.builder.toJSON());
      logger.verbose(
        `${pluginData.builder.name} successfully pushed to plugin list.`
      );
    })
  )
    .then(async () => {
      logger.debug("Successfully pushed all plugins to plugin list.");
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
      logger.debug(`Successfully deployed plugins to Discord`);
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
        logger.debug(`Successfully deployed guild plugins to Discord`)
      )
      .catch(async (error) => {
        logger.error(`${error}`);
      });
  }
};

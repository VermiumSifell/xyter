// Dependencies
import { token, clientId } from "@config/discord";
import { devMode, guildId } from "@config/other";

import logger from "../logger";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default async () => {
  fs.readdir("./src/plugins", async (error: any, plugins: any) => {
    if (error) {
      return logger?.error(new Error(error));
    }

    const pluginList = [] as any;

    await Promise.all(
      plugins?.map(async (pluginName: any) => {
        const plugin = await import(`../plugins/${pluginName}`);

        pluginList.push(plugin.default.data.toJSON());

        logger?.verbose(`Loaded plugin: ${pluginName} for deployment`);
      })
    );

    const rest = new REST({ version: "9" }).setToken(token);

    await rest
      .put(Routes.applicationCommands(clientId), {
        body: pluginList,
      })
      .then(async () => {
        logger?.info(`Successfully deployed plugins to Discord`);
      })
      .catch(async (err: any) => {
        logger.error(err);
      });

    if (devMode) {
      await rest
        .put(Routes.applicationGuildCommands(clientId, guildId), {
          body: pluginList,
        })
        .then(async () =>
          logger?.info(`Successfully deployed guild plugins to Discord`)
        )
        .catch(async (err: any) => {
          logger.error(err);
        });
    }
  });
};

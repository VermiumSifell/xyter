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

    const pluginList = [{} as any];

    await plugins?.map(async (pluginName: any) => {
      const plugin = await import(`../plugins/${pluginName}`);

      pluginList.push(plugin.default.data.toJSON());

      logger?.debug(
        `Successfully deployed plugin: ${plugin?.default?.data?.name} from ${plugin.default?.metadata?.author}`
      );
    });

    const rest = new REST({ version: "9" }).setToken(token);

    await rest
      .put(Routes.applicationCommands(clientId), {
        body: pluginList,
      })
      .then(async () =>
        logger.info("Successfully registered application commands.")
      )
      .catch(async (err: any) => {
        logger.error(err);
      });

    if (devMode) {
      await rest
        .put(Routes.applicationGuildCommands(clientId, guildId), {
          body: pluginList,
        })
        .then(async () =>
          logger.info("Successfully registered guild application commands.")
        )
        .catch(async (err: any) => {
          logger.error(err);
        });
    }
  });
};

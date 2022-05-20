import fs from "fs"; // fs
import { Collection } from "discord.js"; // discord.js
import { Client } from "@root/types/common/discord";
import logger from "@logger";

export default async (client: Client) => {
  client.commands = new Collection();

  fs.readdir("./src/plugins", async (error, plugins) => {
    if (error) {
      return logger.error(`Error reading plugins: ${error}`);
    }

    await Promise.all(
      plugins.map(async (pluginName, index) => {
        const plugin = await import(`../plugins/${pluginName}`);

        await client.commands.set(
          plugin.default.builder.name,
          plugin.default,
          plugin.default.metadata
        );

        logger.verbose(
          `Loaded plugin ${index + 1}/${plugins.length}: ${pluginName}`
        );
      })
    )
      .then(async () => {
        logger.info(`Started all ${plugins.length} plugins.`);
      })
      .catch(async (err) => {
        logger.error(`${err}`);
      });
  });
};

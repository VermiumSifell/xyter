import fs from "fs"; // fs
import { Collection, Client } from "discord.js"; // discord.js
import logger from "../logger";
import { ICommand } from "../interfaces/Command";

export default async (client: Client) => {
  client.commands = new Collection();

  fs.readdir("./src/plugins", async (error, plugins) => {
    if (error) {
      return logger.error(`Error reading plugins: ${error}`);
    }

    await Promise.all(
      plugins.map(async (pluginName, index) => {
        const plugin: ICommand = await import(`../plugins/${pluginName}`);

        await client.commands.set(plugin.builder.name, plugin);

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

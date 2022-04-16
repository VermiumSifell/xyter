import fs from "fs"; // fs
import { Collection } from "discord.js"; // discord.js
import { Client } from "../types/common/discord";
import logger from "../logger";

export default async (client: Client) => {
  client.commands = new Collection();

  fs.readdir("./src/plugins", async (error, plugins) => {
    if (error) {
      return logger?.error(`Error reading plugins: ${error}`);
    }

    await Promise.all(
      plugins?.map(async (pluginName) => {
        const plugin = await import(`../plugins/${pluginName}`);

        await client?.commands?.set(
          plugin?.default?.data?.name,
          plugin?.default
        );

        logger?.verbose(`Loaded plugin: ${pluginName}`);
      })
    );
  });
};

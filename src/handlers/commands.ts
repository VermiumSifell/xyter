import fs from "fs"; // fs
import { Collection } from "discord.js"; // discord.js
import { Client } from "../types/common/discord";
import logger from "../logger";

export default async (client: Client) => {
  client.commands = new Collection();

  fs.readdir("./src/plugins", async (error: any, plugins: any) => {
    if (error) {
      return logger?.error(new Error(error));
    }

    await plugins?.map(async (pluginName: any) => {
      const plugin = await import(`../plugins/${pluginName}`);

      await client?.commands?.set(plugin?.default?.data?.name, plugin?.default);
      logger?.silly(
        `Successfully loaded plugin: ${plugin?.default?.data?.name} from ${plugin.default?.metadata?.author}`
      );
    });
  });
};

import { Collection, Client } from "discord.js";
import listDir from "../../helpers/listDir";
import logger from "../../logger";

import { ICommand } from "../../interfaces/Command";

export const register = async (client: Client) => {
  client.commands = new Collection();

  const commandNames = await listDir("plugins/commands");

  if (!commandNames) throw new Error("Could not list commands");

  logger.info(`Loading ${commandNames.length} commands`);

  await Promise.all(
    commandNames.map(async (commandName) => {
      const command: ICommand = await import(
        `../../plugins/commands/${commandName}`
      ).catch(async (e) => {
        throw new Error(`Could not load command: ${commandName}`, e);
      });

      client.commands.set(command.builder.name, command);

      logger.verbose(`${command.builder.name} loaded`);
    })
  )
    .then(async () => {
      logger.info(`Finished loading commands.`);
    })
    .catch(async (err) => {
      throw new Error(`Could not load commands: ${err}`);
    });
};

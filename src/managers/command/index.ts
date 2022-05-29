import fs from "fs"; // fs
import { Collection, Client } from "discord.js"; // discord.js
import logger from "../../logger";
import { ICommand } from "../../interfaces/Command";
import listDir from "../../helpers/listDir";

export const register = async (client: Client) => {
  client.commands = new Collection();

  const commandNames = await listDir("commands");
  if (!commandNames) return;

  logger.info(`Loading ${commandNames.length} commands`);

  await Promise.all(
    commandNames.map(async (commandName, index) => {
      const command: ICommand = await import(`../../commands/${commandName}`);

      client.commands.set(command.builder.name, command);

      logger.verbose(`${command.builder.name} loaded`);
    })
  )
    .then(async () => {
      logger.info(`Finished loading commands.`);
    })
    .catch(async (err) => {
      logger.error(`${err}`);
    });
};

// 3rd party dependencies
import { CommandInteraction } from "discord.js";

// Dependencies
import isCommand from "@root/events/interactionCreate/components/isCommand";
import logger from "@logger";
import audits from "./audits";
import { IEventOptions } from "@root/interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: CommandInteraction) => {
  const { guild, id } = interaction;

  logger?.silly(
    `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
  );

  await audits.execute(interaction);
  await isCommand(interaction);
};

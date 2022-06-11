import { Interaction } from "discord.js";

import button from "./button";
import command from "./command";

import logger from "../../../../logger";

export const execute = async (interaction: Interaction) => {
  await button(interaction);
  await command(interaction);
};

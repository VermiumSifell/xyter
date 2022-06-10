import { CommandInteraction } from "discord.js";
import logger from "../../../logger";

export const metadata = { guildOnly: false, ephemeral: false };

export const execute = async (interaction: CommandInteraction) => {
  logger.debug("primary button clicked!");
};

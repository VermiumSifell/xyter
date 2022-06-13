import { ButtonInteraction } from "discord.js";
import logger from "../../../logger";

export const metadata = { guildOnly: false, ephemeral: false };

export const execute = async (interaction: ButtonInteraction) => {
  logger.debug(interaction.customId, "primary button clicked!");
};

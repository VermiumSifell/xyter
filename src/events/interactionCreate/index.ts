// 3rd party dependencies
import { CommandInteraction } from "discord.js";

// Dependencies
import isCommand from "@root/events/interactionCreate/components/isCommand";
import logger from "@logger";
import audits from "./audits";

export default {
  async execute(interaction: CommandInteraction) {
    const { guild, id } = interaction;

    logger?.silly(
      `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
    );

    await audits.execute(interaction);
    await isCommand(interaction);
  },
};

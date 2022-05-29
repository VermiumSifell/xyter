import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "../../logger";

import modules from "../../plugins/counters/modules";

export default {
  modules,

  builder: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("View guild counters")

    .addSubcommand(modules.view.builder),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options.getSubcommand() === "view") {
      logger.silly(`Executing view subcommand`);
      return modules.view.execute(interaction);
    }

    logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
  },
};

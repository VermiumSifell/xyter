import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "@logger";

import modules from "@plugins/counters/modules";

export default {
  modules,

  data: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("View guild counters")

    .addSubcommand(modules.view.data),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      logger?.verbose(`Executing view subcommand`);
      return modules.view.execute(interaction);
    }

    logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

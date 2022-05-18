// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import logger from "@logger";

// Modules
import modules from "./modules";

// Function
export default {
  modules,

  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("counters")
      .setDescription("Manage guild counters.")
      .addSubcommand(modules.add.builder)
      .addSubcommand(modules.remove.builder);
  },

  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "add") {
      logger?.verbose(`Executing create subcommand`);

      return modules.add.execute(interaction);
    }

    if (options?.getSubcommand() === "remove") {
      logger?.verbose(`Executing delete subcommand`);

      return modules.remove.execute(interaction);
    }

    logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import logger from "@logger";

// Modules
import modules from "./modules";

// Function
export default {
  modules,

  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("counters")
      .setDescription("Manage guild counters.")
      .addSubcommand(modules.create.data)
      .addSubcommand(modules.delete_.data);
  },

  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "create") {
      logger?.verbose(`Executing create subcommand`);

      return modules.create.execute(interaction);
    }

    if (options?.getSubcommand() === "delete") {
      logger?.verbose(`Executing delete subcommand`);

      return modules.delete_.execute(interaction);
    }

    logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

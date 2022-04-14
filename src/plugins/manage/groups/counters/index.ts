// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import logger from "@logger";

// Modules
import moduleCreate from "./modules/create";
import moduleDelete from "./modules/delete";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("counters")
      .setDescription("Manage guild counters.")
      .addSubcommand(moduleCreate.data)
      .addSubcommand(moduleDelete.data);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "create") {
      logger?.verbose(`Executing create subcommand`);

      return moduleCreate.execute(interaction);
    }

    if (options?.getSubcommand() === "delete") {
      logger?.verbose(`Executing delete subcommand`);

      return moduleDelete.execute(interaction);
    }

    logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

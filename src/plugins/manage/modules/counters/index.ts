// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import logger from "@logger";
import getEmbedConfig from "@helpers/getEmbedConfig";

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
    if (interaction.guild == null) return;
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options } = interaction;

    if (options?.getSubcommand() === "add") {
      logger?.silly(`Executing create subcommand`);

      return modules.add.execute(interaction);
    }

    if (options?.getSubcommand() === "remove") {
      logger?.silly(`Executing delete subcommand`);

      return modules.remove.execute(interaction);
    }

    logger?.silly(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

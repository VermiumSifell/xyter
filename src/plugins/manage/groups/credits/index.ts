// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

import logger from "@logger";

// Modules
import moduleGive from "./modules/give";
import moduleSet from "./modules/set";
import moduleTake from "./modules/take";
import moduleTransfer from "./modules/transfer";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage the credits of a user.")
      .addSubcommand(moduleGive.data)
      .addSubcommand(moduleSet.data)
      .addSubcommand(moduleTake.data)
      .addSubcommand(moduleTransfer.data);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "give") {
      logger?.verbose(`Executing give subcommand`);

      return moduleGive.execute(interaction);
    }

    if (options?.getSubcommand() === "set") {
      logger?.verbose(`Executing set subcommand`);

      return moduleSet.execute(interaction);
    }

    if (options?.getSubcommand() === "take") {
      logger?.verbose(`Executing take subcommand`);

      return moduleTake.execute(interaction);
    }

    if (options?.getSubcommand() === "transfer") {
      logger?.verbose(`Executing transfer subcommand`);

      return moduleTransfer.execute(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};

import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import logger from "@logger";

import modules from "./modules";

export default {
  modules,

  builder: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage the credits of a user.")
      .addSubcommand(modules.give.builder)
      .addSubcommand(modules.set.builder)
      .addSubcommand(modules.take.builder)
      .addSubcommand(modules.transfer.builder);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "give":
        logger.silly(`Executing give subcommand`);

        return modules.give.execute(interaction);
      case "set":
        logger.silly(`Executing set subcommand`);

        return modules.set.execute(interaction);
      case "take":
        logger.silly(`Executing take subcommand`);

        return modules.take.execute(interaction);
      case "transfer":
        logger.silly(`Executing transfer subcommand`);

        return modules.transfer.execute(interaction);
      default:
        logger.silly(`Unknown subcommand ${options.getSubcommand()}`);
    }
  },
};

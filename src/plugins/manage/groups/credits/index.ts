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
        logger.verbose(`Executing give subcommand`);

        return modules.give.execute(interaction);
      case "set":
        logger.verbose(`Executing set subcommand`);

        return modules.set.execute(interaction);
      case "take":
        logger.verbose(`Executing take subcommand`);

        return modules.take.execute(interaction);
      case "transfer":
        logger.verbose(`Executing transfer subcommand`);

        return modules.transfer.execute(interaction);
      default:
        logger.verbose(`Unknown subcommand ${options.getSubcommand()}`);
    }
  },
};

// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "@plugins/utility/modules";

// Handlers
import logger from "../../logger";

// Function
export default {
  modules,

  data: new SlashCommandBuilder()
    .setName("utility")
    .setDescription("Common utility.")

    .addSubcommand(modules.lookup.data)
    .addSubcommand(modules.about.data)
    .addSubcommand(modules.stats.data)
    .addSubcommand(modules.avatar.data),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "lookup":
        return modules.lookup.execute(interaction);
      case "about":
        return modules.about.execute(interaction);
      case "stats":
        return modules.stats.execute(interaction);
      case "avatar":
        return modules.avatar.execute(interaction);
      default:
        logger.error(`Unknown subcommand ${options.getSubcommand()}`);
    }
  },
};

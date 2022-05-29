// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "../../commands/utility/modules";

// Handlers
import logger from "../../logger";

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("utility")
  .setDescription("Common utility.")

  .addSubcommand(modules.lookup.builder)
  .addSubcommand(modules.about.builder)
  .addSubcommand(modules.stats.builder)
  .addSubcommand(modules.avatar.builder);

export const execute = async (interaction: CommandInteraction) => {
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
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("utility")
  .setDescription("Common utility.")

  .addSubcommand(modules.lookup.builder)
  .addSubcommand(modules.about.builder)
  .addSubcommand(modules.stats.builder)
  .addSubcommand(modules.avatar.builder);

export const execute = async (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "lookup":
      return modules.lookup.execute(interaction);
    case "about":
      return modules.about.execute(interaction);
    case "stats":
      return modules.stats.execute(interaction);
    case "avatar":
      return modules.avatar.execute(interaction);
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};

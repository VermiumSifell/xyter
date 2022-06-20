import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("moderation")
  .setDescription("Moderation.")

  .addSubcommand(modules.prune.builder);

export const execute = async (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "prune":
      return modules.prune.execute(interaction);
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};

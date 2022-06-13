import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import modules from "./modules";
export const moduleData = modules;

export const builder = new SlashCommandBuilder()
  .setName("dns")
  .setDescription("DNS commands.")

  .addSubcommand(modules.lookup.builder);

export const execute = async (interaction: CommandInteraction) => {
  switch (interaction.options.getSubcommand()) {
    case "lookup":
      return modules.lookup.execute(interaction);
    default:
      throw new Error(
        `Unknown subcommand: ${interaction.options.getSubcommand()}`
      );
  }
};

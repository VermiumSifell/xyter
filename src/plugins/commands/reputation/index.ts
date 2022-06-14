// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("Manage reputation.")
  .addSubcommand(modules.give.builder);

export const execute = async (interaction: CommandInteraction) => {
  if (interaction.options.getSubcommand() === "give") {
    await modules.give.execute(interaction);
  }
};

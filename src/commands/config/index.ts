// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers
import logger from "../../logger";

export const builder = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Manage guild configurations.")

  .addSubcommand(modules.pterodactyl.builder)
  .addSubcommand(modules.credits.builder)
  .addSubcommand(modules.points.builder)
  .addSubcommand(modules.welcome.builder)
  .addSubcommand(modules.audits.builder)
  .addSubcommand(modules.shop.builder)
  .addSubcommand(modules.embeds.builder);

export const moduleData = modules;

// Function
export const execute = async (interaction: CommandInteraction) => {
  switch (interaction.options?.getSubcommand()) {
    case "pterodactyl":
      return modules.pterodactyl.execute(interaction);
    case "credits":
      return modules.credits.execute(interaction);
    case "points":
      return modules.points.execute(interaction);
    case "welcome":
      return modules.welcome.execute(interaction);
    case "audits":
      return modules.audits.execute(interaction);
    case "shop":
      return modules.shop.execute(interaction);
    case "embeds":
      return modules.embeds.execute(interaction);
  }
};

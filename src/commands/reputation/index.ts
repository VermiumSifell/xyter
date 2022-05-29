// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers
import logger from "../../logger";

export const moduleData = modules;

// Function
export const builder = new SlashCommandBuilder()
  .setName("reputation")
  .setDescription("Manage reputation.")
  .addSubcommand(modules.give.builder);

export const execute = async (interaction: CommandInteraction) => {
  const { options } = interaction;

  if (options?.getSubcommand() === "give") {
    logger?.silly(`Executing give subcommand`);

    await modules.give.execute(interaction);
  }

  logger?.silly(`No subcommand found`);
};

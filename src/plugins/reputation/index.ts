// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers
import logger from "@logger";

// Function
export default {
  modules,
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Manage reputation.")
    .addSubcommand(modules.give.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "give") {
      logger?.verbose(`Executing give subcommand`);

      await modules.give.execute(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};

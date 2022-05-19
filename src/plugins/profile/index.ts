// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "@plugins/profile/modules";

// Handlers
import logger from "@logger";

// Function
export default {
  modules,

  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check a profile.")
    .addSubcommand(modules.view.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      logger?.verbose(`Executing view subcommand`);

      return modules.view.execute(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};

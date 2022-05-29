// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "../../plugins/profile/modules";

// Handlers
import logger from "../../logger";

// Function
export default {
  modules,

  builder: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check a profile.")
    .addSubcommand(modules.view.builder),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      logger?.silly(`Executing view subcommand`);

      return modules.view.execute(interaction);
    }

    logger?.silly(`No subcommand found`);
  },
};

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

  builder: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings.")

    .addSubcommandGroup(modules.guild.builder),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options.getSubcommandGroup() === "guild") {
      logger.silly(`Executing guild subcommand`);

      return modules.guild.execute(interaction);
    }

    logger.silly(`No subcommand group found`);
  },
};

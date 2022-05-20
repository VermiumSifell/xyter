// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Handlers
import logger from "../../logger";

// Function
export default {
  modules,

  builder: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Shop for credits and custom roles.")
    .addSubcommand(modules.pterodactyl.builder)
    .addSubcommandGroup(modules.roles.builder),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "pterodactyl") {
      logger.silly(`Executing pterodactyl subcommand`);

      return modules.pterodactyl.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "roles") {
      logger?.silly(`Subcommand group is roles`);

      return modules.roles.execute(interaction);
    }

    logger?.silly(`No subcommand found.`);
  },
};

// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "./modules";

// Groups
import groups from "./groups";

// Handlers
import logger from "../../logger";

// Function
export default {
  modules,
  groups,

  builder: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Shop for credits and custom roles.")
    .addSubcommand(modules.pterodactyl.builder)
    .addSubcommandGroup(groups.roles.builder),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "pterodactyl") {
      logger.verbose(`Executing pterodactyl subcommand`);

      return modules.pterodactyl.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "roles") {
      logger?.verbose(`Subcommand group is roles`);

      return groups.roles.execute(interaction);
    }

    logger?.verbose(`No subcommand found.`);
  },
};

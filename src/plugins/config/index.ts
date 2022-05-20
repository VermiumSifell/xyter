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
    .setName("config")
    .setDescription("Manage guild configurations.")

    .addSubcommand(modules.pterodactyl.builder)
    .addSubcommand(modules.credits.builder)
    .addSubcommand(modules.points.builder)
    .addSubcommand(modules.welcome.builder)
    .addSubcommand(modules.audits.builder)
    .addSubcommand(modules.shop.builder)
    .addSubcommand(modules.embeds.builder),

  async execute(interaction: CommandInteraction) {
    // Destructure member
    const { options } = interaction;

    switch (options?.getSubcommand()) {
      case "pterodactyl":
        logger?.silly(`Subcommand is pterodactyl`);

        return modules.pterodactyl.execute(interaction);
      case "credits":
        logger?.silly(`Subcommand is credits`);

        return modules.credits.execute(interaction);
      case "points":
        logger?.silly(`Subcommand is points`);

        return modules.points.execute(interaction);
      case "welcome":
        logger?.silly(`Subcommand is welcome`);

        return modules.welcome.execute(interaction);
      case "audits":
        logger?.silly(`Subcommand is audits`);

        return modules.audits.execute(interaction);
      case "shop":
        logger?.silly(`Subcommand is shop`);

        return modules.shop.execute(interaction);
      case "embeds":
        logger?.silly(`Subcommand is shop`);

        return modules.embeds.execute(interaction);
      default:
        logger?.silly(`Subcommand is not found`);
    }
  },
};

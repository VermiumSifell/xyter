// Dependencies
import { Permissions, CommandInteraction } from "discord.js";

// Configurations
import { errorColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "@logger";

// Modules
import modules from "./modules";

import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

// Function
export default {
  modules,

  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("guild")
      .setDescription("Guild settings.")
      .addSubcommand(modules.pterodactyl.data)
      .addSubcommand(modules.credits.data)
      .addSubcommand(modules.points.data)
      .addSubcommand(modules.welcome.data)
      .addSubcommand(modules.audits.data)
      .addSubcommand(modules.shop.data);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { options } = interaction;

    switch (options?.getSubcommand()) {
      case "pterodactyl":
        logger?.verbose(`Subcommand is pterodactyl`);

        return modules.pterodactyl.execute(interaction);
      case "credits":
        logger?.verbose(`Subcommand is credits`);

        return modules.credits.execute(interaction);
      case "points":
        logger?.verbose(`Subcommand is points`);

        return modules.points.execute(interaction);
      case "welcome":
        logger?.verbose(`Subcommand is welcome`);

        return modules.welcome.execute(interaction);
      case "audits":
        logger?.verbose(`Subcommand is audits`);

        return modules.audits.execute(interaction);
      case "shop":
        logger?.verbose(`Subcommand is shop`);

        return modules.shop.execute(interaction);
      default:
        logger?.verbose(`Subcommand is not found`);
    }
  },
};

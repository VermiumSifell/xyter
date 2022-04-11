// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import pterodactyl from "./modules/pterodactyl";

// Groups
import roles from "./roles";

// Handlers
import logger from "../../handlers/logger";

// Function
export default {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Open our shop.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pterodactyl")
        .setDescription("Buy pterodactyl power.")
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("How much credits you want to withdraw.")
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("roles")
        .setDescription("Manage custom roles.")
        .addSubcommand((command) =>
          command
            .setName("buy")
            .setDescription("Buy a custom role")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name of the role you wish to purchase.")
            )
            .addStringOption((option) =>
              option
                .setName("color")
                .setDescription(
                  "Color of the role you wish to purchase (For example RED or BLUE or GREEN)."
                )
            )
        )
        .addSubcommand((command) =>
          command
            .setName("cancel")
            .setDescription("Cancel a custom role")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Name of the role you wish to cancel.")
            )
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options, commandName, user, guild } = interaction;

    // Module - Pterodactyl
    if (options?.getSubcommand() === "pterodactyl") {
      // Execute Module - Pterodactyl
      return pterodactyl(interaction);
    }

    // Group - Roles
    else if (options?.getSubcommandGroup() === "roles") {
      // Execute Group - Roles
      return roles(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

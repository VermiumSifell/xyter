// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../../logger";

// Modules
import appearance from "./modules/appearance";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("user")
      .setDescription("Manage user settings.")
      .addSubcommand((command) =>
        command
          .setName("appearance")
          .setDescription("Manage your appearance")
          .addStringOption((option) =>
            option
              .setName("language")
              .setDescription("Configure your language")
              .addChoice("English", "en")
              .addChoice("Swedish", "sv")
          )
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, user, options, commandName } = interaction;

    // Module - Appearance
    if (options?.getSubcommand() === "appearance") {
      // Execute Module - Appearance
      await appearance(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

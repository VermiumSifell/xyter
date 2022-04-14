// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "@logger";

// Modules
import appearance from "./modules/appearance";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("user")
      .setDescription("User settings.")
      .addSubcommand((command) =>
        command
          .setName("appearance")
          .setDescription("User appearance settings.")
          .addStringOption((option) =>
            option
              .setName("language")
              .setDescription("Set the language.")
              .addChoice("English", "en")
              .addChoice("Swedish", "sv")
          )
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "appearance") {
      logger?.verbose(`Executing appearance subcommand`);

      await appearance(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};

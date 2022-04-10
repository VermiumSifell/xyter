// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

// Modules
import view from "./modules/view";

// Handlers
import logger from "../../handlers/logger";

// Function
export default {
  data: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("Manage counters.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a counter.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The counter channel you want to view")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const { options, guild, user, commandName } = interaction;

    // Module - View
    if (options?.getSubcommand() === "view") {
      // Execute Module - View
      return await view(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

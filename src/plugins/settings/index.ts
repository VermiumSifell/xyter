// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Groups
import guildGroup from "./guild";
import userGroup from "./user";

// Handlers
import logger from "../../logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings.")
    .addSubcommandGroup((group) =>
      group
        .setName("guild")
        .setDescription("Manage guild settings.")
        .addSubcommand((command) =>
          command
            .setName("pterodactyl")
            .setDescription("Controlpanel.gg")
            .addStringOption((option) =>
              option
                .setName("url")
                .setDescription("The api url")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("token")
                .setDescription("The api token")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("credits")
            .setDescription("Credits")
            .addBooleanOption((option) =>
              option
                .setName("status")
                .setDescription("Should credits be enabled?")
            )
            .addNumberOption((option) =>
              option
                .setName("rate")
                .setDescription("Amount of credits per message.")
            )
            .addNumberOption((option) =>
              option
                .setName("minimum-length")
                .setDescription("Minimum length of message to earn credits.")
            )
            .addNumberOption((option) =>
              option
                .setName("work-rate")
                .setDescription("Maximum amount of credits on work.")
            )
            .addNumberOption((option) =>
              option
                .setName("work-timeout")
                .setDescription(
                  "Timeout between work schedules (milliseconds)."
                )
            )
            .addNumberOption((option) =>
              option
                .setName("timeout")
                .setDescription(
                  "Timeout between earning credits (milliseconds)."
                )
            )
        )
        .addSubcommand((command) =>
          command
            .setName("points")
            .setDescription("Points")
            .addBooleanOption((option) =>
              option
                .setName("status")
                .setDescription("Should credits be enabled?")
            )
            .addNumberOption((option) =>
              option
                .setName("rate")
                .setDescription("Amount of credits per message.")
            )
            .addNumberOption((option) =>
              option
                .setName("minimum-length")
                .setDescription("Minimum length of message to earn credits.")
            )
            .addNumberOption((option) =>
              option
                .setName("timeout")
                .setDescription(
                  "Timeout between earning credits (milliseconds)."
                )
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
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
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options, commandName, user, guild } = interaction;

    // Group - Guild
    if (options.getSubcommandGroup() === "guild") {
      // Execute Group - Guild
      await guildGroup(interaction);
    }
    // Group - User
    else if (options.getSubcommandGroup() === "user") {
      // Execute Group - User
      await userGroup(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

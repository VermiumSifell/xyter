// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import give from "./modules/give";

// Handlers
import logger from "../../logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Give reputation.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give reputation to a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user you want to repute.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("What type of reputation you want to repute")
            .setRequired(true)
            .addChoice("Positive", "positive")
            .addChoice("Negative", "negative")
        )
    ),
  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options, guild, user, commandName } = interaction;

    // Module - Give
    if (options?.getSubcommand() === "give") {
      // Execute Module - Give
      await give(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

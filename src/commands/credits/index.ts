// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../handlers/logger";

// Modules
import balance from "./modules/balance";
import gift from "./modules/gift";
import top from "./modules/top";
import work from "./modules/work";

// Function
export default {
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("balance")
        .setDescription("Check a user's balance.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user whose balance you want to check.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("gift")
        .setDescription("Gift someone credits from your credits.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user you want to pay.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount you will pay.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Your reason.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("top").setDescription("Check the top balance.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("work").setDescription("Work for credits.")
    ),
  async execute(interaction: CommandInteraction) {
    const { options, user, guild, commandName } = interaction;

    // Module - Balance
    if (options?.getSubcommand() === "balance") {
      // Execute Module - Balance
      return await balance(interaction);
    }

    // Module - Gift
    else if (options?.getSubcommand() === "gift") {
      // Execute Module - Gift
      return await gift(interaction);
    }

    // Module - Top
    else if (options?.getSubcommand() === "top") {
      // Execute Module - Top
      return await top(interaction);
    }

    // Module - Work
    else if (options?.getSubcommand() === "work") {
      // Execute Module - Work
      return await work(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

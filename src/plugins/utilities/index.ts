// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import lookup from "./modules/lookup";
import about from "./modules/about";
import stats from "./modules/stats";

// Handlers
import logger from "../../logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("utilities")
    .setDescription("Common utilities.")
    .addSubcommand(lookup.data)
    .addSubcommand(about.data)
    .addSubcommand(stats.data),
  async execute(interaction: CommandInteraction) {
    const { options, guild, user, commandName } = interaction;

    if (options?.getSubcommand() === "lookup") {
      logger.verbose(`Executing lookup subcommand`);

      return lookup.execute(interaction);
    }

    if (options?.getSubcommand() === "about") {
      logger.verbose(`Executing about subcommand`);

      return about.execute(interaction);
    }

    if (options?.getSubcommand() === "stats") {
      logger.verbose(`Executing stats subcommand`);

      return stats.execute(interaction);
    }

    logger.verbose(`No subcommand found.`);
  },
};

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
    .setDescription("Manage reputation.")
    .addSubcommand(give.data),
  async execute(interaction: CommandInteraction) {
    const { options, guild, user, commandName } = interaction;

    if (options?.getSubcommand() === "give") {
      logger?.verbose(`Executing give subcommand`);

      await give.execute(interaction);
    }

    logger?.verbose(`No subcommand found`);
  },
};

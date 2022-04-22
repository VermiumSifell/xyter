// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Groups
import guildGroup from "./guild";

// Handlers
import logger from "@logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings.")

    .addSubcommandGroup(guildGroup.data),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options.getSubcommandGroup() === "guild") {
      logger.verbose(`Executing guild subcommand`);

      return guildGroup.execute(interaction);
    }

    logger.verbose(`No subcommand group found`);
  },
};

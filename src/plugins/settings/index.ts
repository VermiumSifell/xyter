// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Groups
import groups from "./groups";

// Handlers
import logger from "@logger";

// Function
export default {
  groups,

  builder: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings.")

    .addSubcommandGroup(groups.guild.builder),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options.getSubcommandGroup() === "guild") {
      logger.verbose(`Executing guild subcommand`);

      return groups.guild.execute(interaction);
    }

    logger.verbose(`No subcommand group found`);
  },
};

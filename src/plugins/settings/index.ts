// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Groups
import guildGroup from "./guild";
import userGroup from "./user";

// Handlers
import logger from "@logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage settings.")
    .addSubcommandGroup(guildGroup.data)
    .addSubcommandGroup(userGroup.data),

  async execute(interaction: CommandInteraction) {
    const { options, commandName, user, guild } = interaction;

    if (options.getSubcommandGroup() === "guild") {
      logger.verbose(`Executing guild subcommand`);

      return guildGroup.execute(interaction);
    }

    if (options.getSubcommandGroup() === "user") {
      logger.verbose(`Executing user subcommand`);

      return userGroup.execute(interaction);
    }

    logger.verbose(`No subcommand group found`);
  },
};

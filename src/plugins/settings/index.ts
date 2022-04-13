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
    .addSubcommandGroup(guildGroup.data)
    .addSubcommandGroup(userGroup.data),

  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options, commandName, user, guild } = interaction;

    // Group - Guild
    if (options.getSubcommandGroup() === "guild") {
      // Execute Group - Guild
      await guildGroup.execute(interaction);
    }
    // Group - User
    else if (options.getSubcommandGroup() === "user") {
      // Execute Group - User
      await userGroup.execute(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

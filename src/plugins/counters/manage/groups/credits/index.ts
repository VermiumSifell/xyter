// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

// Modules
import moduleGive from "./modules/give";
import moduleSet from "./modules/set";
import moduleTake from "./modules/take";
import moduleTransfer from "./modules/transfer";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage guild member's credits.")
      .addSubcommand(moduleGive.data)
      .addSubcommand(moduleSet.data)
      .addSubcommand(moduleTake.data)
      .addSubcommand(moduleTransfer.data);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "give") {
      return moduleGive.execute(interaction);
    }

    if (options?.getSubcommand() === "set") {
      return moduleSet.execute(interaction);
    }

    if (options?.getSubcommand() === "take") {
      return moduleTake.execute(interaction);
    }

    if (options?.getSubcommand() === "transfer") {
      return moduleTransfer.execute(interaction);
    }
  },
};

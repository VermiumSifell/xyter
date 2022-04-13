// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import moduleCreate from "./modules/create";
import moduleDelete from "./modules/delete";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("counters")
      .setDescription("Manage your guild's counters.")
      .addSubcommand(moduleCreate.data)
      .addSubcommand(moduleDelete.data);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "create") {
      return moduleCreate.execute(interaction);
    }

    if (options?.getSubcommand() === "delete") {
      return moduleDelete.execute(interaction);
    }
  },
};

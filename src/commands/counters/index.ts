// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

// Modules
import moduleView from "./modules/view";

// Function
export default {
  data: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("Manage counters.")
    .addSubcommand(moduleView.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      return moduleView.execute(interaction);
    }
  },
};

// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

// Modules
import modules from "./modules";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("Manage counters.")
    .addSubcommand(modules?.view?.data),
  async execute(interaction: CommandInteraction, tools: any) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      return modules?.view?.execute(interaction, tools);
    }
  },
};

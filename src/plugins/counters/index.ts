// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

import modules from "@root/plugins/counters/modules";

export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("counters")
    .setDescription("Manage counters.")
    .addSubcommand(modules.view.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "view") {
      return modules.view.execute(interaction);
    }
  },
};

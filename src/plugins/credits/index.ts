// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import modules from "@root/plugins/credits/modules";

export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .addSubcommand(modules.balance.data)
    .addSubcommand(modules.gift.data)
    .addSubcommand(modules.top.data)
    .addSubcommand(modules.work.data),
  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    if (options?.getSubcommand() === "balance") {
      return modules.balance.execute(interaction);
    }

    if (options?.getSubcommand() === "gift") {
      return modules.gift.execute(interaction);
    }

    if (options?.getSubcommand() === "top") {
      return modules.top.execute(interaction);
    }

    if (options?.getSubcommand() === "work") {
      return modules.work.execute(interaction);
    }
  },
};

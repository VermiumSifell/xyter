// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import moduleBalance from "./modules/balance";
import moduleGift from "./modules/gift";
import moduleTop from "./modules/top";
import moduleWork from "./modules/work";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .addSubcommand(moduleBalance.data)
    .addSubcommand(moduleGift.data)
    .addSubcommand(moduleTop.data)
    .addSubcommand(moduleWork.data),
  async execute(interaction: CommandInteraction, tools: any) {
    const { options } = interaction;

    if (options?.getSubcommand() === "balance") {
      return moduleBalance.execute(interaction, tools);
    }

    if (options?.getSubcommand() === "gift") {
      return moduleGift.execute(interaction, tools);
    }

    if (options?.getSubcommand() === "top") {
      return moduleTop.execute(interaction, tools);
    }

    if (options?.getSubcommand() === "work") {
      return moduleWork.execute(interaction, tools);
    }
  },
};

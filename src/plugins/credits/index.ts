// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import logger from "@logger";

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
      logger?.verbose(`Executing balance subcommand`);
      return modules.balance.execute(interaction);
    }

    if (options?.getSubcommand() === "gift") {
      logger?.verbose(`Executing gift subcommand`);
      return modules.gift.execute(interaction);
    }

    if (options?.getSubcommand() === "top") {
      logger?.verbose(`Executing top command`);
      return modules.top.execute(interaction);
    }

    if (options?.getSubcommand() === "work") {
      logger?.verbose(`Executing work command`);
      return modules.work.execute(interaction);
    }

    logger?.verbose(`Unknown subcommand ${options?.getSubcommand()}`);
  },
};

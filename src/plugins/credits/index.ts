import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import logger from "@logger";

import modules from "@plugins/credits/modules";

export default {
  modules,

  builder: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")

    .addSubcommand(modules.balance.builder)
    .addSubcommand(modules.gift.builder)
    .addSubcommand(modules.top.builder)
    .addSubcommand(modules.work.builder),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "balance":
        await modules.balance.execute(interaction);
        break;
      case "gift":
        await modules.gift.execute(interaction);
        break;
      case "top":
        await modules.top.execute(interaction);
        break;
      case "work":
        await modules.work.execute(interaction);
        break;
      default:
        logger.verbose(`Unknown subcommand ${options.getSubcommand()}`);
    }
  },
};

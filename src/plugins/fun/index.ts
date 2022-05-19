import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import logger from "@logger";

import modules from "@plugins/fun/modules";

export default {
  modules,

  data: new SlashCommandBuilder()
    .setName("fun")
    .setDescription("Fun commands.")

    .addSubcommand(modules.meme.data),

  async execute(interaction: CommandInteraction) {
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "meme":
        await modules.meme.execute(interaction);
        break;
      default:
        logger.verbose(`Unknown subcommand ${options.getSubcommand()}`);
    }
  },
};

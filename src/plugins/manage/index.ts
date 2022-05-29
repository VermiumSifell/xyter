//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Groups
import modules from "../../plugins/manage/modules";
import logger from "../../logger";

// Function
export default {
  modules,

  builder: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Manage the bot.")
    .addSubcommandGroup(modules.counters.builder)
    .addSubcommandGroup(modules.credits.builder),

  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options } = interaction;

    if (options?.getSubcommandGroup() === "credits") {
      logger?.silly(`Subcommand group is credits`);

      return modules.credits.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "counters") {
      logger?.silly(`Subcommand group is counters`);

      return modules.counters.execute(interaction);
    }

    logger?.silly(`Subcommand group is not credits or counters`);
  },
};

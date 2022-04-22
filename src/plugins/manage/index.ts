//Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions, MessageEmbed } from "discord.js";

// Configurations
import { errorColor, footerText, footerIcon } from "@config/embed";

// Groups
import groups from "@plugins/manage/groups";
import logger from "@logger";

// Function
export default {
  groups,

  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Manage the bot.")
    .addSubcommandGroup(groups.counters.data)
    .addSubcommandGroup(groups.credits.data),

  async execute(interaction: CommandInteraction) {
    // Destructure
    const { options } = interaction;

    if (options?.getSubcommandGroup() === "credits") {
      logger?.verbose(`Subcommand group is credits`);

      return groups.credits.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "counters") {
      logger?.verbose(`Subcommand group is counters`);

      return groups.counters.execute(interaction);
    }

    logger?.verbose(`Subcommand group is not credits or counters`);
  },
};

// Dependencies
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Modules
import pterodactyl from "./modules/pterodactyl";

// Groups
import roles from "./roles";

// Handlers
import logger from "../../logger";

// Function
export default {
  metadata: { author: "Zyner" },
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Shop for credits and custom roles.")
    .addSubcommand(pterodactyl.data)
    .addSubcommandGroup(roles.data),
  async execute(interaction: CommandInteraction) {
    const { options, commandName, user, guild } = interaction;

    if (options?.getSubcommand() === "pterodactyl") {
      logger.verbose(`Executing pterodactyl subcommand`);

      return pterodactyl.execute(interaction);
    }

    if (options?.getSubcommandGroup() === "roles") {
      logger?.verbose(`Subcommand group is roles`);

      return roles.execute(interaction);
    }

    logger?.verbose(`No subcommand found.`);
  },
};

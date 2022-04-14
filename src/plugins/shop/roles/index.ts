// Dependencies
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../../logger";

// Modules
import buy from "./modules/buy";
import cancel from "./modules/cancel";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("roles")
      .setDescription("Shop for custom roles.")
      .addSubcommand(buy.data)
      .addSubcommand(cancel.data);
  },
  execute: async (interaction: CommandInteraction) => {
    const { options } = interaction;

    if (options?.getSubcommand() === "buy") {
      logger.verbose(`Executing buy subcommand`);

      await buy.execute(interaction);
    }

    if (options?.getSubcommand() === "cancel") {
      logger.verbose(`Executing cancel subcommand`);

      await cancel.execute(interaction);
    }
  },
};

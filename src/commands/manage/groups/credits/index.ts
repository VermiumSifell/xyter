// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

// Modules
import moduleGive from "./modules/give";
import moduleSet from "./modules/set";
import moduleTake from "./modules/take";
import moduleTransfer from "./modules/transfer";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage guild credits.")
      .addSubcommand(moduleGive.data)
      .addSubcommand(moduleSet.data)
      .addSubcommand(moduleTake.data)
      .addSubcommand(moduleTransfer.data);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { options } = interaction;

    // Module - Give
    if (options?.getSubcommand() === "give") {
      // Execute Module - Give
      return moduleGive.execute(interaction);
    }

    // Module - Set
    else if (options?.getSubcommand() === "set") {
      // Execute Module - Set
      return moduleSet.execute(interaction);
    }

    // Module - Take
    else if (options?.getSubcommand() === "take") {
      // Execute Module - Take
      return moduleTake.execute(interaction);
    }

    // Module - Transfer
    else if (options?.getSubcommand() === "transfer") {
      // Execute Module - Transfer
      return moduleTransfer.execute(interaction);
    }
  },
};

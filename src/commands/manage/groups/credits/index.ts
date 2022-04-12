// Dependencies
import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

// Modules
import give from "./modules/give";
import take from "./modules/take";
import set from "./modules/set";
import transfer from "./modules/transfer";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("credits")
      .setDescription("Manage credits.")
      .addSubcommand((command) =>
        command
          .setName("give")
          .setDescription("Give credits to a user")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user you want to pay.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount you will pay.")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("set")
          .setDescription("Set credits to a user")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user you want to set credits on.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount you will set.")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("take")
          .setDescription("Take credits from a user")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The user you want to take credits from.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount you will take.")
              .setRequired(true)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("transfer")
          .setDescription("Transfer credits from a user to another user.")
          .addUserOption((option) =>
            option
              .setName("from")
              .setDescription("The user you want to take credits from.")
              .setRequired(true)
          )
          .addUserOption((option) =>
            option
              .setName("to")
              .setDescription("The user you want to give credits to.")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("amount")
              .setDescription("The amount you will transfer.")
              .setRequired(true)
          )
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { options } = interaction;

    // Module - Give
    if (options?.getSubcommand() === "give") {
      // Execute Module - Give
      return give(interaction);
    }

    // Module - Take
    else if (options?.getSubcommand() === "take") {
      // Execute Module - Take
      return take(interaction);
    }

    // Module - Set
    else if (options?.getSubcommand() === "set") {
      // Execute Module - Set
      return set(interaction);
    }

    // Module - Transfer
    else if (options?.getSubcommand() === "transfer") {
      // Execute Module - Transfer
      return transfer(interaction);
    }
  },
};

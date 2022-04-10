// Dependencies
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../../handlers/logger";

// Modules
import buy from "./modules/buy";
import cancel from "./modules/cancel";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, commandName, guild, user } = interaction;

  // Module - Buy
  if (options?.getSubcommand() === "buy") {
    // Execute Module - Buy
    await buy(interaction);
  }

  // Module - Cancel
  if (options?.getSubcommand() === "cancel") {
    // Execute Module - Cancel
    await cancel(interaction);
  }

  // Send debug message
  return logger?.debug(
    `Guild: ${guild?.id} User: ${
      user?.id
    } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
  );
};

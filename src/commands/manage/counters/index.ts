// Dependencies
import { CommandInteraction } from "discord.js";

// Handlers
import logger from "../../../handlers/logger";

// Modules
import add from "./modules/add";
import remove from "./modules/remove";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, guild, user, commandName } = interaction;

  // Module - Add
  if (options?.getSubcommand() === "add") {
    // Execute Module - Add
    return add(interaction);
  }

  // Module - Remove
  else if (options?.getSubcommand() === "remove") {
    // Execute Module - Remove
    return remove(interaction);
  }

  // Log debug message
  return logger?.debug(
    `Guild: ${guild?.id} User: ${
      user?.id
    } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
  );
};

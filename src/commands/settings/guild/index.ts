// Dependencies
import { Permissions, ColorResolvable, CommandInteraction } from "discord.js";

// Configurations
import config from "../../../../config.json";

// Handlers
import logger from "../../../handlers/logger";

// Modules
import pterodactyl from "./addons/pterodactyl";
import credits from "./addons/credits";
import points from "./addons/points";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { memberPermissions, options, commandName, user, guild } = interaction;

  // Check permission
  if (!memberPermissions?.has(Permissions?.FLAGS?.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":tools: Settings - Guild" as string,
      color: config?.colors?.error as ColorResolvable,
      description: "You do not have permission to manage this!" as string,
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  }

  // Module - Pterodactyl
  if (options?.getSubcommand() === "pterodactyl") {
    // Execute Module - Pterodactyl
    return pterodactyl(interaction);
  }

  // Module - Credits
  else if (options?.getSubcommand() === "credits") {
    // Execute Module - Credits
    return credits(interaction);
  }

  // Module - Points
  else if (options?.getSubcommand() === "points") {
    // Execute Module - Points
    return points(interaction);
  }

  // Send debug message
  return logger?.debug(
    `Guild: ${guild?.id} User: ${
      user?.id
    } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
  );
};

// Dependencies
import { Permissions, CommandInteraction } from "discord.js";

// Configurations
import { errorColor, footerText, footerIcon } from "@config/embed";

// Handlers
import logger from "../../../logger";

// Modules
import pterodactyl from "./modules/pterodactyl";
import credits from "./modules/credits";
import points from "./modules/points";
import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

// Function
export default {
  data: (group: SlashCommandSubcommandGroupBuilder) => {
    return group
      .setName("guild")
      .setDescription("Manage guild settings.")
      .addSubcommand(pterodactyl.data)
      .addSubcommand(credits.data)
      .addSubcommand(points.data);
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { memberPermissions, options, commandName, user, guild } =
      interaction;

    // Check permission
    if (!memberPermissions?.has(Permissions?.FLAGS?.MANAGE_GUILD)) {
      // Create embed object
      const embed = {
        title: ":tools: Settings - Guild",
        color: errorColor,
        description: "You do not have permission to manage this!",
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon as string,
          text: footerText as string,
        },
      };

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    }

    // Module - Pterodactyl
    if (options?.getSubcommand() === "pterodactyl") {
      // Execute Module - Pterodactyl
      return pterodactyl.execute(interaction);
    }

    // Module - Credits
    else if (options?.getSubcommand() === "credits") {
      // Execute Module - Credits
      return credits.execute(interaction);
    }

    // Module - Points
    else if (options?.getSubcommand() === "points") {
      // Execute Module - Points
      return points.execute(interaction);
    }

    // Send debug message
    return logger?.debug(
      `Guild: ${guild?.id} User: ${
        user?.id
      } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
    );
  },
};

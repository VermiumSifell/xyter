import { ColorResolvable, CommandInteraction } from "discord.js";
import config from "../../../config.json";
import logger from "../../logger";
import guilds from "../../database/schemas/guild";

import tools from "../../tools";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { client, guild } = interaction;

  // Get command from collection
  const command = client.commands.get(interaction.commandName);

  // If command do not exist
  if (!command) return;

  // Create guild if it does not exist already
  await guilds.findOne({ guildId: guild?.id }, { new: true, upsert: true });

  // Defer reply
  await interaction.deferReply({ ephemeral: true });

  try {
    // Execute command
    await command.execute(interaction, tools);

    const { commandName, user } = interaction;

    return logger?.verbose(
      `Guild: ${guild?.id} User: ${user?.tag} executed ${commandName}`
    );
  } catch (e) {
    // Send debug message
    logger.error(e);

    // Send interaction reply
    await interaction.editReply({
      embeds: [
        {
          author: {
            name: client?.user?.username,
            icon_url: client?.user?.displayAvatarURL(),
            url: "https://bot.zyner.org/",
          },
          title: "Error",
          description: "There was an error while executing this command!",
          color: config.colors.error as ColorResolvable,
          timestamp: new Date(),
        },
      ],
    });
  }
};

import config from "../../../config.json";
import logger from "../../logger";
import guilds from "../../database/schemas/guild";

import { Interaction, ColorResolvable } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    // Destructure member, client
    const { client, guild } = interaction;

    // If interaction is command
    if (interaction.isCommand()) {
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
        await command.execute(interaction);

        const { commandName, user, options } = interaction;

        logger?.verbose(
          `Guild: ${guild?.id} User: ${
            user?.id
          } executed /${commandName} ${options?.getSubcommandGroup()} ${options?.getSubcommand()}`
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
    }
  },
};

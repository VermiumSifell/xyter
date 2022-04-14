// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "@logger";

import { errorColor, footerText, footerIcon } from "@config/embed";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { client, guild, commandName, user } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) return;

  await interaction.deferReply({ ephemeral: true });

  await currentCommand
    .execute(interaction)
    .then(async () => {
      return logger?.verbose(
        `Command: ${commandName} executed in guild: ${guild?.name} (${guild?.id}) by user: ${user?.tag} (${user?.id})`
      );
    })
    .catch(async (error: any) => {
      logger?.error(error);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("Error")
            .setDescription(
              `There was an error executing the command: **${currentCommand?.data?.name}**.`
            )
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
};

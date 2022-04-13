// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "@logger";

import * as embed from "@config/embed";

import guildSchema from "@schemas/guild";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { client, guild, commandName, user } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) return;

  // If command do not exist

  // Create guild if it does not exist already
  await guildSchema.findOne(
    { guildId: guild?.id },
    { new: true, upsert: true }
  );

  // Defer reply
  await interaction.deferReply({ ephemeral: true });

  await currentCommand
    .execute(interaction)
    .then(async () => {
      return logger.debug(
        `Guild: ${guild?.id} (${guild?.name}) User: ${user?.tag} executed ${commandName}`
      );
    })
    .catch(async (error: any) => {
      console.log(error);

      logger.error(
        `Guild: ${guild?.id} (${guild?.name}) User: ${user?.tag} There was an error executing the command: ${commandName}`
      );

      logger.error(error);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("Error")
            .setDescription(
              `There was an error executing the command: **${currentCommand.data.name}**.`
            )
            .setColor(embed.errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: embed.footerText, iconURL: embed.footerIcon }),
        ],
      });
    });
};

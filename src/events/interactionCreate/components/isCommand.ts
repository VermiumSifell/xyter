// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "@logger";

import deferReply from "@root/helpers/deferReply";
import getEmbedConfig from "@helpers/getEmbedConfig";
import getCommandMetadata from "@helpers/getCommandMetadata";
import capitalizeFirstLetter from "@helpers/capitalizeFirstLetter";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;
  if (interaction.guild == null) return;

  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  const { client, guild, commandName, user, memberPermissions } = interaction;

  const currentCommand = client.commands.get(commandName);

  if (currentCommand == null) {
    logger.silly(`Command ${commandName} not found`);
  }

  const metadata = await getCommandMetadata(interaction, currentCommand);

  await deferReply(interaction, metadata.ephemeral || false);

  if (
    metadata.permissions &&
    metadata.guildOnly &&
    !memberPermissions?.has(metadata.permissions)
  ) {
    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:x:] Permission")
          .setDescription(`You do not have the permission to manage the bot.`)
          .setTimestamp(new Date())
          .setColor(errorColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  }

  if (metadata.guildOnly) {
    if (!guild) {
      logger.debug(`Guild is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("This command is only available for guild")
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
  }

  if (metadata.dmOnly) {
    if (guild) {
      logger.silly(`Guild exist`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("This command is only available in DM.")
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
  }

  await currentCommand
    .execute(interaction)
    .then(async () => {
      return logger?.silly(
        `Command: ${commandName} executed in guild: ${guild?.name} (${guild?.id}) by user: ${user?.tag} (${user?.id})`
      );
    })
    .catch(async (error: string) => {
      logger?.error(`${error}`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `[:x:] ${capitalizeFirstLetter(
                interaction.options.getSubcommand()
              )}`
            )
            .setDescription(`${"``"}${error}${"``"}`)
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    });
};

// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "../../../logger";

import deferReply from "../../../helpers/deferReply";
import getEmbedConfig from "../../../helpers/getEmbedConfig";
import getCommandMetadata from "../../../helpers/getCommandMetadata";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter";
import timeoutSchema from "../../../models/timeout";
import addSeconds from "../../../helpers/addSeconds";

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

  if (metadata.cooldown) {
    console.log("cooldown");
    // console.log(interaction);

    // Check if user has a timeout
    const isTimeout = await timeoutSchema.findOne({
      guildId: guild.id,
      userId: user.id,
      cooldown: metadata.cooldown,
      timeoutId: interaction.commandId,
    });

    // If user is not on timeout
    if (isTimeout) {
      logger?.silly(`User is on timeout`);

      const { guildId, userId, timeoutId, cooldown, createdAt } = isTimeout;

      const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

      if (overDue) {
        timeoutSchema
          .deleteOne({
            guildId,
            userId,
            timeoutId,
            cooldown,
          })
          .then(async () => {
            logger.debug(
              `Timeout document ${timeoutId} has been deleted from user ${userId}.`
            );
          });
      } else {
        const diff = Math.round(
          ((new Date(isTimeout.createdAt).getTime() - new Date().getTime()) *
            -1) /
            1000
        );

        return interaction?.editReply({
          embeds: [
            {
              title: `[:x:] ${capitalizeFirstLetter(
                interaction.options.getSubcommand()
              )}`,
              description: `
            You are currently on timeout, please wait ${diff} seconds.

            If it still doesn't work, please wait for a maximum of **1 hour** before contacting bot owner.
            `,
              timestamp: new Date(),
              color: errorColor,
              footer: {
                iconURL: footerIcon,
                text: footerText,
              },
            },
          ],
        });
      }
    }

    await timeoutSchema.create({
      guildId: guild.id,
      userId: user.id,
      cooldown: metadata.cooldown,
      timeoutId: interaction.commandId,
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

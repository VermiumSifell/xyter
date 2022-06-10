// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "../../../../logger";

import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import capitalizeFirstLetter from "../../../../helpers/capitalizeFirstLetter";
import * as cooldown from "../../../../helpers/cooldown";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isButton()) return;

  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  const { guild, customId, user, memberPermissions } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (currentButton == null) {
    logger.silly(`Button ${customId} not found`);
  }

  const metadata = currentButton.metadata;

  await deferReply(interaction, metadata.ephemeral || false);

  if (metadata.guildOnly) {
    if (!guild) {
      logger.debug(`Guild is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:x:] Permission")
            .setDescription("This command is only available for guild")
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
  }

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

  if (metadata.dmOnly) {
    if (guild) {
      logger.silly(`Guild exist`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle("[:x:] Permission")
            .setDescription("This command is only available in DM.")
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
  }

  if (metadata.cooldown) {
    await cooldown
      .interaction(interaction, metadata.cooldown)
      .catch(async (error) => {
        return interaction?.editReply({
          embeds: [
            new MessageEmbed()
              .setTitle("[:x:] Permission")
              .setDescription(`${error}`)
              .setTimestamp(new Date())
              .setColor(errorColor)
              .setFooter({ text: footerText, iconURL: footerIcon }),
          ],
        });
      });
  }

  await currentButton
    .execute(interaction)
    .then(async () => {
      return logger?.silly(
        `Button: ${customId} executed in guild: ${guild?.name} (${guild?.id}) by user: ${user?.tag} (${user?.id})`
      );
    })
    .catch(async (error: string) => {
      logger?.debug(`INTERACTION BUTTON CATCH: ${error}`);

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

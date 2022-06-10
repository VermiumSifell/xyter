import { CommandInteraction, MessageEmbed } from "discord.js";
import * as cooldown from "../../../../helpers/cooldown";
import logger from "../../../../logger";

export default async (
  interaction: CommandInteraction,
  metadata: any,
  embedConfig: any
) => {
  if (
    metadata.permissions &&
    metadata.guildOnly &&
    !interaction.memberPermissions?.has(metadata.permissions)
  ) {
    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:x:] Permission")
          .setDescription(`You do not have the permission to manage the bot.`)
          .setTimestamp(new Date())
          .setColor(embedConfig.errorColor)
          .setFooter({
            text: embedConfig.footerText,
            iconURL: embedConfig.footerIcon,
          }),
      ],
    });
  }

  logger.info(metadata);

  if (metadata.cooldown) {
    await cooldown
      .interaction(interaction, metadata.cooldown)
      .catch(async (error) => {
        throw new Error("Cooldown error: " + error);
      });
  }

  if (metadata.guildOnly) {
    if (!interaction.guild) {
      throw new Error("This command is guild only.");
    }
  }

  if (metadata.dmOnly) {
    if (interaction.guild) {
      throw new Error("This command is DM only.");
    }
  }
};

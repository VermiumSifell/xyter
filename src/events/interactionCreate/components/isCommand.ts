// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "@logger";

import { errorColor, footerText, footerIcon } from "@config/embed";
import i18next from "i18next";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  const { client, guild, commandName, user, memberPermissions } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) {
    logger.verbose(`Command ${commandName} not found`);
  }

  // logger.warn(currentCommand.modules[interaction.options.getSubcommand()].meta);

  // const meta = { ephemeral: false, guildOnly: false };

  let meta;

  if (!interaction.options.getSubcommandGroup(false)) {
    meta = currentCommand.modules[interaction.options.getSubcommand()].meta;
  } else {
    meta =
      currentCommand.groups[interaction.options.getSubcommandGroup()].modules[
        interaction.options.getSubcommand()
      ].meta;
  }

  await interaction.deferReply({ ephemeral: meta?.ephemeral || false });

  if (
    meta.permissions &&
    meta.guildOnly &&
    !memberPermissions?.has(meta.permissions)
  ) {
    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:toolbox:] Manage")
          .setDescription(`You do not have the permission to manage the bot.`)
          .setTimestamp(new Date())
          .setColor(errorColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  }

  if (meta.guildOnly) {
    if (!guild) {
      logger.verbose(`Guild is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription(
              i18next.t("guildOnly", {
                lng: interaction.locale,
                ns: "errors",
              })
            )
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
  }

  if (meta.dmOnly) {
    if (guild) {
      logger.verbose(`Guild exist`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription(
              i18next.t("dmOnly", {
                lng: interaction.locale,
                ns: "errors",
              })
            )
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

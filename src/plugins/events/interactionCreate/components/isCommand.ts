// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

import logger from "../../../../logger";

import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import getCommandMetadata from "../../../../helpers/getCommandMetadata";
import capitalizeFirstLetter from "../../../../helpers/capitalizeFirstLetter";
import * as cooldown from "../../../../helpers/cooldown";

export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

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

  if (metadata.guildOnly && !guild)
    throw new Error("This command is guild only.");

  if (
    metadata.permissions &&
    metadata.guildOnly &&
    !memberPermissions?.has(metadata.permissions)
  )
    throw new Error("You don't have the required permissions");

  if (metadata.dmOnly && guild)
    throw new Error("This command is only available in DM");

  if (metadata.cooldown)
    await cooldown.interaction(interaction, metadata.cooldown);

  await currentCommand.execute(interaction);
};

// 3rd party dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Dependencies
import isCommand from "../../events/interactionCreate/components/isCommand";
import isButton from "../../events/interactionCreate/components/isButton";
import logger from "../../../logger";
import audits from "./audits";
import { IEventOptions } from "../../../interfaces/EventOptions";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter";
import getEmbedConfig from "../../../helpers/getEmbedConfig";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: CommandInteraction) => {
  const { guild, id } = interaction;

  logger?.silly(
    `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
  );

  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await audits.execute(interaction);

  try {
    await isCommand(interaction);
    await isButton(interaction);
  } catch (error) {
    logger.debug(`${error}`);

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
  }
};

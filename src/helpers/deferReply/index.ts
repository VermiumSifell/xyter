import { CommandInteraction, MessageEmbed } from "discord.js";
import getEmbedConfig from "../../helpers/getEmbedConfig";

export default async (interaction: CommandInteraction, ephemeral: boolean) => {
  await interaction.deferReply({
    ephemeral,
  });

  const { waitColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await interaction.editReply({
    embeds: [
      new MessageEmbed()
        .setFooter({
          text: footerText,
          iconURL: footerIcon,
        })
        .setTimestamp(new Date())
        .setTitle("Processing your request")
        .setColor(waitColor)
        .setDescription("Please wait..."),
    ],
  });
};

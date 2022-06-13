import { Interaction, MessageEmbed } from "discord.js";
import getEmbedConfig from "../../helpers/getEmbedConfig";

export default async (interaction: Interaction, ephemeral: boolean) => {
  if (!interaction.isRepliable())
    throw new Error(`Cannot reply to an interaction that is not repliable`);

  await interaction.deferReply({
    ephemeral,
  });

  const embedConfig = await getEmbedConfig(interaction.guild);

  await interaction.editReply({
    embeds: [
      new MessageEmbed()
        .setFooter({
          text: embedConfig.footerText,
          iconURL: embedConfig.footerIcon,
        })
        .setTimestamp(new Date())
        .setTitle("Processing your request")
        .setColor(embedConfig.waitColor)
        .setDescription("Please wait..."),
    ],
  });
};

import { BaseInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../helpers/getEmbedData";

export default async (interaction: BaseInteraction, ephemeral: boolean) => {
  if (!interaction.isRepliable())
    throw new Error(`Cannot reply to an interaction that is not repliable`);

  await interaction.deferReply({
    ephemeral,
  });

  const embedConfig = await getEmbedConfig(interaction.guild);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setFooter({
          text: embedConfig.footerText,
          iconURL: embedConfig.footerIcon,
        })
        .setTimestamp(new Date())
        .setTitle("⏳︱Your request are being processed")
        .setColor(embedConfig.waitColor)
        .setDescription("This might take a while, please wait..."),
    ],
  });
};

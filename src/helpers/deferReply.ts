import { CommandInteraction, MessageEmbed } from "discord.js";
import { waitColor, footerText, footerIcon } from "@config/embed";

export default async (interaction: CommandInteraction, ephemeral: boolean) => {
  await interaction.deferReply({
    ephemeral,
  });

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

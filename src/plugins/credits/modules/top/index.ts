// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

import userSchema from "@schemas/user";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Helpers
import pluralize from "@helpers/pluralize";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("top").setDescription("Check the top balance.");
  },
  execute: async (interaction: CommandInteraction) => {
    // Get all users in the guild

    const usersDB = await userSchema.find({ guildId: interaction?.guild?.id });

    const topTen = usersDB

      // Sort them after credits amount (ascending)
      .sort((a, b) => (a?.credits > b?.credits ? -1 : 1))

      // Return the top 10
      .slice(0, 10);

    // Create entry object
    const entry = (x: any, index: number) =>
      `**Top ${index + 1}** - <@${x?.userId}> ${pluralize(
        x?.credits,
        "credit"
      )}`;

    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle("[:dollar:] Credits (Top)")
          .setDescription(
            `Below are the top ten.

            ${topTen?.map((x, index) => entry(x, index))?.join("\n")}`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  },
};

// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ColorResolvable, MessageEmbed } from "discord.js";

// Configurations
import { colors, footer } from "../../../../../config.json";

// Models
import userSchema from "../../../../database/schemas/user";

// helpers
import pluralize from "../../../../helpers/pluralize";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("top").setDescription("Check the top balance.");
  },
  execute: async (interaction: CommandInteraction, tools: any) => {
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
          .setColor(colors?.success as ColorResolvable)
          .setFooter({ text: footer?.text, iconURL: footer?.icon }),
      ],
    });
  },
};

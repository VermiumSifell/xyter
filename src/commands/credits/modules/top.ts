// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../config.json";

// Models
import userSchema from "../../../database/schemas/user";

// helpers
import creditNoun from "../../../helpers/creditNoun";

// Function
export default async (interaction: CommandInteraction) => {
  // Get all users in the guild

  const usersDB = await userSchema.find({ guildId: interaction?.guild?.id });

  const topTen = usersDB

    // Sort them after credits amount (ascending)
    .sort((a, b) => (a?.credits > b?.credits ? -1 : 1))

    // Return the top 10
    .slice(0, 10);

  // Create entry object
  const entry = (x: any, index: number) =>
    `**Top ${index + 1}** - <@${x?.userId}> ${creditNoun(x?.credits)}`;

  // Create embed object
  const embed = {
    title: ":dollar: Credits [Top]" as string,
    description: `Below are the top ten.\n${topTen
      ?.map((x, index) => entry(x, index))
      ?.join("\n")}` as string,
    color: config?.colors?.success as ColorResolvable,
    timestamp: new Date(),
    footer: {
      iconURL: config?.footer?.icon as string,
      text: config?.footer?.text as string,
    },
  };

  // Return interaction reply
  return interaction?.editReply({ embeds: [embed] });
};

// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../config.json";

// Models
import counterSchema from "../../../helpers/database/models/counterSchema";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, guild } = interaction;

  // Get options
  const optionChannel = options?.getChannel("channel");

  const counter = await counterSchema?.findOne({
    guildId: guild?.id,
    channelId: optionChannel?.id,
  });

  if (!counter) {
    // Create embed object
    const embed = {
      title: ":1234: Counters [View]" as string,
      description: `${optionChannel} is not a counting channel.` as string,
      timestamp: new Date() as Date,
      color: config?.colors?.error as ColorResolvable,
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send interaction reply
    return await interaction?.editReply({ embeds: [embed] });
  }

  // Embed object
  const embed = {
    title: ":1234: Counters [View]" as string,
    color: config.colors.success as ColorResolvable,
    description: `${optionChannel} is currently at number ${counter?.counter}.`,
    timestamp: new Date() as Date,
    footer: {
      iconURL: config?.footer?.icon as string,
      text: config?.footer?.text as string,
    },
  };

  // Send interaction reply
  return await interaction?.editReply({ embeds: [embed] });
};

// Dependencies
import { ColorResolvable, CommandInteraction } from "discord.js";

// Configurations
import config from "../../../../../config.json";

// Handlers
import logger from "../../../../handlers/logger";

// Models
import counterSchema from "../../../../helpers/database/models/counterSchema";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { options, guild, user } = interaction;

  // Get options
  const optionChannel = options?.getChannel("channel");

  await counterSchema
    ?.deleteOne({
      guildId: guild?.id,
      channelId: optionChannel?.id,
    })
    ?.then(async () => {
      // Embed object
      const embed = {
        title: ":toolbox: Admin - Counters [Remove]" as string,
        description:
          `${optionChannel} is no longer an counting channel.` as string,
        timestamp: new Date() as Date,
        color: config?.colors?.success as ColorResolvable,
        footer: {
          iconURL: config?.footer?.icon as string,
          text: config?.footer?.text as string,
        },
      };

      // Return interaction reply
      return interaction?.editReply({ embeds: [embed] });
    });

  // Send debug message
  return logger?.debug(
    `Guild: ${guild?.id} User: ${user?.id} removed ${optionChannel?.id} as a counter.`
  );
};

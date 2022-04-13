// Dependencies
import { ColorResolvable, CommandInteraction } from "discord.js";

// Configurations
import config from "../../../../../config.json";

// Handlers
import logger from "../../../../logger";

// Models
import guildSchema from "../../../../database/schemas/guild";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { options, guild, user } = interaction;

  // Get options
  const status = options?.getBoolean("status");
  const rate = options?.getNumber("rate");
  const timeout = options?.getNumber("timeout");
  const minimumLength = options?.getNumber("minimum-length");

  // Get guild object
  const guildDB = await guildSchema?.findOne({
    guildId: guild?.id,
  });

  if (guildDB === null) return;

  // Modify values
  guildDB.points.status = status !== null ? status : guildDB?.points?.status;
  guildDB.points.rate = rate !== null ? rate : guildDB?.points?.rate;
  guildDB.points.timeout =
    timeout !== null ? timeout : guildDB?.points?.timeout;
  guildDB.points.minimumLength =
    minimumLength !== null ? minimumLength : guildDB?.points?.minimumLength;

  // Save guild
  await guildDB?.save()?.then(async () => {
    // Create embed object
    const embed = {
      title: ":hammer: Settings - Guild [Points]" as string,
      description: "Following settings is set!" as string,
      color: config.colors.success as ColorResolvable,
      fields: [
        {
          name: "🤖 Status" as string,
          value: `${guildDB?.points?.status}` as string,
          inline: true,
        },
        {
          name: "📈 Rate" as string,
          value: `${guildDB?.points?.rate}` as string,
          inline: true,
        },
        {
          name: "🔨 Minimum Length" as string,
          value: `${guildDB?.points?.minimumLength}` as string,
          inline: true,
        },
        {
          name: "⏰ Timeout" as string,
          value: `${guildDB?.points?.timeout}` as string,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: config?.footer?.icon as string,
        text: config?.footer?.text as string,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user?.id} has changed credit details.`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  });
};

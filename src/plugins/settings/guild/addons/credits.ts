// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

//Handlers
import logger from "@logger";

// Models
import guildSchema from "@schemas/guild";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user, options } = interaction;

  // Get options
  const status = options?.getBoolean("status");
  const rate = options?.getNumber("rate");
  const timeout = options?.getNumber("timeout");
  const minimumLength = options?.getNumber("minimum-length");
  const workRate = options?.getNumber("work-rate");
  const workTimeout = options?.getNumber("work-timeout");

  // Get guild object
  const guildDB = await guildSchema?.findOne({
    guildId: guild?.id,
  });

  if (guildDB === null) return;

  // Modify values
  guildDB.credits.status = status !== null ? status : guildDB?.credits?.status;
  guildDB.credits.rate = rate !== null ? rate : guildDB?.credits?.rate;
  guildDB.credits.timeout =
    timeout !== null ? timeout : guildDB?.credits?.timeout;
  guildDB.credits.workRate =
    workRate !== null ? workRate : guildDB?.credits?.workRate;
  guildDB.credits.workTimeout =
    workTimeout !== null ? workTimeout : guildDB?.credits?.workTimeout;
  guildDB.credits.minimumLength =
    minimumLength !== null ? minimumLength : guildDB?.credits?.minimumLength;

  // Save guild
  await guildDB?.save()?.then(async () => {
    // Embed object
    const embed = {
      title: ":tools: Settings - Guild [Credits]",
      description: "Following settings is set!",
      color: successColor,
      fields: [
        {
          name: "🤖 Status",
          value: `${guildDB?.credits?.status}`,
          inline: true,
        },
        {
          name: "📈 Rate",
          value: `${guildDB?.credits?.rate}`,
          inline: true,
        },
        {
          name: "📈 Work Rate",
          value: `${guildDB?.credits?.workRate}`,
          inline: true,
        },
        {
          name: "🔨 Minimum Length",
          value: `${guildDB?.credits?.minimumLength}`,
          inline: true,
        },
        {
          name: "⏰ Timeout",
          value: `${guildDB?.credits?.timeout}`,
          inline: true,
        },
        {
          name: "⏰ Work Timeout",
          value: `${guildDB?.credits?.workTimeout}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };

    // Send debug message
    logger?.debug(
      `Guild: ${guild?.id} User: ${user.id} has changed credit details.`
    );

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  });
};

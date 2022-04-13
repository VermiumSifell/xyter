// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { hosterName, hosterUrl } from "@config/other";

// Function
export default async (interaction: CommandInteraction) => {
  const interactionEmbed = {
    title: ":hammer: Utilities [About]",
    description: `This bot is hosted by ${
      hosterUrl ? `[${hosterName}](${hosterUrl})` : `${hosterName}`
    }, the bot is developed by [Zyner](https://github.com/ZynerOrg)!

    If you are interested in contributing, then just [fork it](https://github.com/ZynerOrg/xyter) yourself, we :heart: Open Source.`,
    color: successColor,
    timestamp: new Date(),
    footer: {
      iconURL: footerIcon,
      text: footerText,
    },
  };
  interaction?.editReply({ embeds: [interactionEmbed] });
};

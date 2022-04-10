// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import config from "../../../../config.json";

// Function
export default async (interaction: CommandInteraction) => {
  const interactionEmbed = {
    title: ":hammer: Utilities [About]" as string,
    description: `This bot is hosted by ${
      config?.hoster?.url
        ? `[${config?.hoster?.name}](${config?.hoster?.url})`
        : `${config?.hoster?.name}`
    }, the bot is developed by [Zyner](https://github.com/ZynerOrg)!

    If you are interested in contributing, then just [fork it](https://github.com/ZynerOrg/xyter) yourself, we :heart: Open Source.` as string,
    color: config?.colors?.success as ColorResolvable,
    timestamp: new Date(),
    footer: {
      iconURL: config?.footer?.icon as string,
      text: config?.footer?.text as string,
    },
  };
  interaction?.editReply({ embeds: [interactionEmbed] });
};

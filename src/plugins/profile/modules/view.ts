// Dependencies
import { CommandInteraction, ColorResolvable } from "discord.js";

// Configurations
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Models
import fetchUser from "@helpers/fetchUser";

// Function
export default async (interaction: CommandInteraction) => {
  // Destructure
  const { client, options, user, guild } = interaction;

  // Target information
  const target = options?.getUser("target");

  // Discord User Information
  const discordUser = await client?.users?.fetch(
    `${target ? target?.id : user?.id}`
  );

  if (guild === null) return;

  // User Information
  const userObj = await fetchUser(discordUser, guild);

  // Embed object
  const embed = {
    author: {
      name: `${discordUser?.username}#${discordUser?.discriminator}`,
      icon_url: discordUser?.displayAvatarURL(),
    },
    color: successColor,
    fields: [
      {
        name: `:dollar: Credits`,
        value: `${userObj?.credits || "Not found"}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Level`,
        value: `${userObj?.level || "Not found"}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Points`,
        value: `${userObj?.points || "Not found"}`,
        inline: true,
      },
      {
        name: `:loudspeaker: Reputation`,
        value: `${userObj?.reputation || "Not found"}`,
        inline: true,
      },
      {
        name: `:rainbow_flag: Language`,
        value: `${userObj?.language || "Not found"}`,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      iconURL: footerIcon,
      text: footerText,
    },
  };

  // Return interaction reply
  return interaction?.editReply({ embeds: [embed] });
};

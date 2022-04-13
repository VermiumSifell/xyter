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
      name: `${discordUser?.username}#${discordUser?.discriminator}` as string,
      icon_url: discordUser?.displayAvatarURL() as string,
    },
    color: successColor,
    fields: [
      {
        name: `:dollar: Credits` as string,
        value: `${userObj?.credits || "Not found"}` as string,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Level` as string,
        value: `${userObj?.level || "Not found"}` as string,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Points` as string,
        value: `${userObj?.points || "Not found"}` as string,
        inline: true,
      },
      {
        name: `:loudspeaker: Reputation` as string,
        value: `${userObj?.reputation || "Not found"}` as string,
        inline: true,
      },
      {
        name: `:rainbow_flag: Language` as string,
        value: `${userObj?.language || "Not found"}` as string,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      iconURL: footerIcon as string,
      text: footerText as string,
    },
  };

  // Return interaction reply
  return interaction?.editReply({ embeds: [embed] });
};

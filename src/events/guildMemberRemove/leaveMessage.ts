import logger from "@logger";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "@schemas/guild";

import { footerText, footerIcon, errorColor } from "@config/embed";

export default {
  execute: async (member: GuildMember) => {
    logger.info(member);

    const guildData = await guildSchema.findOne({ guildId: member.guild.id });

    const { client } = member;

    if (guildData === null) return;

    if (guildData.welcome.status !== true) return;
    if (!guildData.welcome.leaveChannel) return;

    const channel = client.channels.cache.get(
      `${guildData.welcome.leaveChannel}`
    );

    if (channel === null) return;

    (channel as TextChannel).send({
      embeds: [
        new MessageEmbed()
          .setColor(errorColor)
          .setTitle(`${member.user.username} has left the server!`)
          .setThumbnail(member.user.displayAvatarURL())
          .setDescription(
            guildData.welcome.leaveChannelMessage ||
              "Configure a leave message in the `/settings guild welcome`."
          )
          .setTimestamp()
          .setFooter({
            text: footerText,
            iconURL: footerIcon,
          }),
      ],
    });
  },
};

import logger from "@logger";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "@schemas/guild";

import { footerText, footerIcon, errorColor } from "@config/embed";

export default {
  execute: async (member: GuildMember) => {
    const guildData = await guildSchema.findOne({ guildId: member.guild.id });

    const { client } = member;

    if (guildData === null) return;

    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) return;

    const channel = client.channels.cache.get(`${guildData.audits.channelId}`);

    if (channel === null) return;

    (channel as TextChannel)
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(errorColor)
            .setAuthor({
              name: "Member Left",
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(`${member.user} ${member.user.tag}`)
            .setTimestamp()
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      })
      .then(async () => {
        logger.info(
          `Audit log sent for event guildMemberRemove in guild ${member.guild.name} (${member.guild.id})`
        );
      })
      .catch(async () => {
        logger.error(
          `Audit log failed to send for event guildMemberRemove in guild ${member.guild.name} (${member.guild.id})`
        );
      });
  },
};

import logger from "../../logger";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "../../models/guild";

import getEmbedConfig from "../../helpers/getEmbedConfig";

export default {
  execute: async (member: GuildMember) => {
    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      member.guild
    );

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
            .setColor(successColor)
            .setAuthor({
              name: "Member Joined",
              iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(`${member.user} ${member.user.tag}`)
            .addFields([
              { name: "Account Age", value: `${member.user.createdAt}` },
            ])
            .setTimestamp()
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      })
      .then(async () => {
        logger.info(
          `Audit log sent for event guildMemberAdd in guild ${member.guild.name} (${member.guild.id})`
        );
      })
      .catch(async () => {
        logger.error(
          `Audit log failed to send for event guildMemberAdd in guild ${member.guild.name} (${member.guild.id})`
        );
      });
  },
};

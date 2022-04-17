import logger from "@logger";
import { Message, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "@schemas/guild";

import { footerText, footerIcon, successColor } from "@config/embed";

export default {
  execute: async (message: Message) => {
    if (message === null) return;

    if (message.guild === null) return;

    const guildData = await guildSchema.findOne({
      guildId: message.guild.id,
    });

    const { client } = message;

    if (guildData === null) return;

    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) return;

    const channel = client.channels.cache.get(`${guildData.audits.channelId}`);

    if (channel === null) return;

    (channel as TextChannel).send({
      embeds: [
        new MessageEmbed()
          .setColor(successColor)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(
            `
            **Message sent by** ${message.author} **deleted in** ${message.channel}
            ${message.content}
            `
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

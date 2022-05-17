/* eslint-disable no-loops/no-loops */
import logger from "@logger";
import { Message, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "@schemas/guild";

import { footerText, footerIcon, successColor } from "@config/embed";

export default {
  execute: async (oldMessage: Message, newMessage: Message) => {
    if (oldMessage === null) return;
    if (newMessage === null) return;

    if (oldMessage.guild === null) return;
    if (newMessage.guild === null) return;

    const guildData = await guildSchema.findOne({
      guildId: oldMessage.guild.id,
    });

    const { client } = oldMessage;

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
              name: newMessage.author.username,
              iconURL: newMessage.author.displayAvatarURL(),
            })
            .setDescription(
              `
              **Message edited in** ${newMessage.channel} [jump to message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})
            `
            )
            .setTimestamp()
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      })
      .then(async () => {
        logger.info(
          `Audit log sent for event messageUpdate in guild ${newMessage?.guild?.name} (${newMessage?.guild?.id})`
        );
      })
      .catch(async () => {
        logger.error(
          `Audit log failed to send for event messageUpdate in guild ${newMessage?.guild?.name} (${newMessage?.guild?.id})`
        );
      });
  },
};

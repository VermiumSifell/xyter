import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

import counterSchema from "@schemas/counter";
import i18next from "i18next";

export default {
  meta: { guildOnly: true, ephemeral: false },

  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription(`View a guild counter`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            `The channel that contains the counter you want to view`
          )
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },

  execute: async (interaction: CommandInteraction) => {
    const { options, guild, locale } = interaction;

    const discordChannel = options?.getChannel("channel");

    const embed = new MessageEmbed()
      .setTitle(
        i18next.t("counters:modules:view:general:title", {
          lng: locale,
          ns: "plugins",
        })
      )
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(
              i18next.t("counters:modules:view:error01:description", {
                lng: locale,
                ns: "plugins",
                channel: discordChannel,
              })
            )
            .setColor(errorColor),
        ],
      });
    }

    return interaction?.editReply({
      embeds: [
        embed
          .setDescription(
            i18next.t("counters:modules:view:success01:description", {
              lng: locale,
              ns: "plugins",
              channel: discordChannel,
              amount: counter.counter,
            })
          )
          .setColor(successColor),
      ],
    });
  },
};

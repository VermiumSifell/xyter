import config from "../../../../config.json";
import { CommandInteraction, ColorResolvable } from "discord.js";
export default async (interaction: CommandInteraction) => {
  const { client } = interaction;
  if (client?.uptime === null) return;
  let totalSeconds = client?.uptime / 1000;
  const days = Math?.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  const hours = Math?.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math?.floor(totalSeconds / 60);
  const seconds = Math?.floor(totalSeconds % 60);

  const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

  const interactionEmbed = {
    title: ":hammer: Utilities - Stats" as string,
    description:
      "Below you can see a list of statistics about the bot." as string,
    fields: [
      {
        name: "⏰ Latency" as string,
        value: `${Date?.now() - interaction?.createdTimestamp} ms` as string,
        inline: true,
      },
      {
        name: "⏰ API Latency" as string,
        value: `${Math?.round(client?.ws?.ping)} ms` as string,
        inline: true,
      },
      {
        name: "⏰ Uptime" as string,
        value: `${uptime}` as string,
        inline: false,
      },
      {
        name: "📈 Guilds" as string,
        value: `${client?.guilds?.cache?.size}` as string,
        inline: true,
      },
      {
        name: "📈 Users (non-unique)" as string,
        value: `${client?.guilds?.cache?.reduce(
          (acc, guild) => acc + guild?.memberCount,
          0
        )}` as string,
        inline: true,
      },
    ],
    color: config?.colors?.success as ColorResolvable,
    timestamp: new Date(),
    footer: {
      iconURL: config?.footer?.icon as string,
      text: config?.footer?.text as string,
    },
  };
  interaction?.editReply({ embeds: [interactionEmbed] });
};

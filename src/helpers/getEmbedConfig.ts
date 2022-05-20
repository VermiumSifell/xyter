import guildSchema from "@schemas/guild";

import { ColorResolvable, Guild } from "discord.js";

export default async (guild: Guild) => {
  const guildConfig = await guildSchema.findOne({ guildId: guild.id });

  if (guildConfig == null)
    return {
      successColor: "#22bb33" as ColorResolvable,
      waitColor: "#f0ad4e" as ColorResolvable,
      errorColor: "#bb2124" as ColorResolvable,
      footerIcon: "https://github.com/ZynerOrg.png",
      footerText: "https://github.com/ZynerOrg/xyter",
    };

  return guildConfig.embeds;
};

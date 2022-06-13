import guildSchema from "../../models/guild";
import * as embedConfig from "../../config/embed";

import { Guild } from "discord.js";

export default async (guild?: Guild | null) => {
  if (!guild) {
    return { ...embedConfig };
  }

  const guildConfig = await guildSchema.findOne({ guildId: guild.id });
  if (!guildConfig) {
    return {
      ...embedConfig,
    };
  }
  return guildConfig.embeds;
};

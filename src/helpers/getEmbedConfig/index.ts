import guildSchema from "../../database/schemas/guild";
import * as embedConfig from "../../config/embed";

import { Guild } from "discord.js";

export default async (guild: Guild | null) => {
  if (guild == null)
    return {
      ...embedConfig,
    };

  const guildConfig = await guildSchema.findOne({ guildId: guild.id });

  if (guildConfig == null)
    return {
      ...embedConfig,
    };

  return guildConfig.embeds;
};

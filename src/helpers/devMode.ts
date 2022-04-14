// Dependencies
import { Client } from "discord.js";

import logger from "@logger";

// Configuration
import { devMode, guildId } from "@config/other";

export default async (client: Client) => {
  if (!devMode) {
    return client?.application?.commands?.set([], guildId).then(async () => {
      return logger?.verbose(
        `Development commands disabled for guild: ${guildId}`
      );
    });
  }

  return logger?.verbose(`Development commands enabled for guild: ${guildId}`);
};

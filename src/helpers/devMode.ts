// Dependencies
import { Client } from "discord.js";

import logger from "@logger";

// Configuration
import { devMode, guildId } from "@config/other";

export default async (client: Client) => {
  // if (!devMode) {
  //   client?.application?.commands?.set([], guildId).then(async () => {
  //     logger.verbose(`Removed all guild based commands from ${guildId}`);
  //   });
  // }
};

// Dependencies
import { Client } from "discord.js";
import logger from "../../logger";

// Function
export default async (client: Client) => {
  const status = `${client?.guilds?.cache?.size} guilds.`;

  client?.user?.setPresence({
    activities: [{ type: "WATCHING", name: status }],
    status: "online",
  });
  logger?.debug(`Updated client presence to: ${status}`);
};

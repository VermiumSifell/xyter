// Dependencies
import { Client } from 'discord.js';

// Function
export default async (client: Client) => {
  // Set client status
  client?.user?.setPresence({
    activities: [
      { type: 'WATCHING', name: `${client?.guilds?.cache?.size} guilds` },
    ],
    status: 'online',
  });
};

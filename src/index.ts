// Dependencies
import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime
import { Client, Intents } from "discord.js"; // discord.js

import locale from "@locale";
import database from "@database";
import schedules from "@schedules";

import events from "@handlers/events";
import commands from "@handlers/commands";

// Configurations
import { token } from "@config/discord";

async function main() {
  const client = new Client({
    intents: [
      Intents?.FLAGS?.GUILDS,
      Intents?.FLAGS?.GUILD_MESSAGES,
      Intents?.FLAGS?.GUILD_MEMBERS,
    ],
  });

  await locale();
  await database();
  await schedules(client);

  await commands(client);
  await events(client);

  await client?.login(token);
}

main();

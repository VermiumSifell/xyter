import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import locale from "@locale";
import database from "@database";
import schedules from "@schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

async function main() {
  const client = new Client({
    intents,
  });

  await locale();
  await database();
  await schedules(client);

  await commands(client);
  await events(client);

  await client.login(token);
}

main();

import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@root/events";
import schedules from "@handlers/schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

const main = async () => {
  const client = new Client({
    intents,
  });

  await database();
  await schedules(client);

  await commands(client);
  await events(client);

  await client.login(token);
};

main();

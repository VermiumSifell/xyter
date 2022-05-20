import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@root/events";
import schedules from "@handlers/schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

// Main process that starts all other sub processes
const main = async () => {
  // Initiate client object
  const client = new Client({
    intents,
  });

  // Start database manager
  await database();

  // Start schedule manager
  await schedules(client);

  // Start command handler
  await commands(client);

  // Start event handler
  await events(client);

  // Authorize with Discord's API
  await client.login(token);
};

main();

import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@database";
import schedules from "@handlers/schedules";
import * as eventManager from "@root/managers/event";
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
  await eventManager.register(client);

  // Authorize with Discord's API
  await client.login(token);
};

main();

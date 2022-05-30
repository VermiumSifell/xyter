import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "./config/discord";

import { Client } from "discord.js"; // discord.js

import * as databaseManager from "./managers/database";
import * as scheduleManager from "./managers/schedule";
import * as eventManager from "./managers/event";
import * as commandManager from "./managers/command";

// Main process that starts all other sub processes
const main = async () => {
  // Initiate client object
  const client = new Client({
    intents,
  });

  // Start managers
  await databaseManager.start();
  await scheduleManager.start(client);
  await commandManager.register(client);
  await eventManager.register(client);

  // Authorize with Discord's API
  await client.login(token);
};

main();

import "tsconfig-paths/register"; // Allows using tsconfig.json paths during runtime

import { token, intents } from "@config/discord";

import { Client } from "discord.js"; // discord.js

import database from "@database";
import schedules from "@schedules";
import events from "@handlers/events";
import commands from "@handlers/commands";

const client = new Client({
  intents,
});

database();
schedules(client);

commands(client);
events(client);

client.login(token);

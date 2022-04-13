// Dependencies
import { Client, Intents } from "discord.js"; // discord.js

import database from "./database";
import locale from "./handlers/locale";
import schedules from "./schedules";

import events from "./handlers/events";
import commands from "./handlers/commands";

import config from "../config.json";

const client = new Client({
  intents: [
    Intents?.FLAGS?.GUILDS,
    Intents?.FLAGS?.GUILD_MESSAGES,
    Intents?.FLAGS?.GUILD_MEMBERS,
  ],
});

database();
locale();
schedules(client);

commands(client);
events(client);

client?.login(config?.bot?.token);

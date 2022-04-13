// Dependencies
import { Client, Intents } from "discord.js"; // discord.js
import "tsconfig-paths/register";

// Configurations
import { bot } from "../config.json";

import database from "@root/database";
import schedules from "./schedules";

// Handlers
import events from "./handlers/events";
import commands from "./handlers/commands";
import locale from "./handlers/locale";

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

client?.login(bot?.token);

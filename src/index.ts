// Dependencies
import { Client, Intents } from 'discord.js'; // discord.js

import database from './helpers/database/index';
import events from './handlers/events';
// import { database } from './helpers'; // helpers
// import { events, commands, locale, schedules } from './handlers'; // handlers

import config from '../config.json'; // config.json

(async () => {
  // Initialize discord.js client
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
    ],
  });

  await database();
  // await locale();
  await events(client);
  // await commands(client);
  // await schedules(client);
  await client.login(config.bot.token);
})();

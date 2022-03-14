// Dependencies
const { Client, Intents } = require('discord.js'); // discord.js

const { database } = require('./helpers'); // helpers
const { events, commands, locale, schedules } = require('./handlers'); // handlers

const config = require('../config.json'); // config.json

(async () => {
  // Initialize discord.js client
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  await database();
  await locale();
  await events(client);
  await commands(client);
  await schedules(client);

  await client.login(config.bot.token);
})();

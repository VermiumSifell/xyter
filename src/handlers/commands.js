const fs = require('fs'); // fs
const { Collection } = require('discord.js'); // discord.js

module.exports = async (client) => {
  client.commands = new Collection();
  const commandFiles = fs.readdirSync('./src/commands');

  for (const file of commandFiles) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
  }
};

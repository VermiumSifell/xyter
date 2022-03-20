import fs from 'fs'; // fs
import { Collection, Client } from 'discord.js'; // discord.js

export default async (client: Client) => {
  client.commands = new Collection();
  const commandFiles = fs.readdirSync('./src/commands');

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.data.name, command);
  }
};

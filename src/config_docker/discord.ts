import { Intents } from "discord.js"; // discord.js

// Discord API token
export const token = process.env["DISCORD_TOKEN"];

// Discord API id
export const clientId = process.env["DISCORD_CLIENT_ID"];

// Discord API intents
export const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS,
];

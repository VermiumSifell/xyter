// Dependencies
import { Message } from 'discord.js';

// Models
import userSchema from '../../helpers/database/models/userSchema';
import guildSchema from '../../helpers/database/models/guildSchema';

// Modules
import points from './modules/points';
import credits from './modules/credits';
import counters from './modules/counters';
import fetchUser from '../../helpers/fetchUser';
import fetchGuild from '../../helpers/fetchGuild';

// Function
export default {
  name: 'messageCreate',
  async execute(message: Message) {
    const { author, guild } = message;

    // If message author is bot
    if (author?.bot) return;

    if (guild === null) return;

    // Get guild object
    const guildObj = await fetchGuild(guild);

    // Get guild object
    const userObj = await fetchUser(author, guild);

    // Execute Module - Credits
    await credits(guildObj, userObj, message);

    // Execute Module - Points
    await points(guildObj, userObj, message);

    // Execute Module - Counters
    await counters(guildObj, userObj, message);
  },
};

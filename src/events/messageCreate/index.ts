import { guilds, users } from '../../helpers/database/models';
import { points, credits, counter } from './modules';

export default {
  name: 'messageCreate',
  async execute(message) {
    const { guild, author } = message;

    // If message author is bot
    if (author.bot) return;

    // Get guild object
    const guildDB = await guilds.findOne({ guildId: guild.id });

    // Get guild object
    const userDB = await users.findOne({
      guildId: guild.id,
      userId: author.id,
    });

    // Manage credits

    await credits(guildDB, userDB, message);

    // Manage points
    await points(guildDB, userDB, message);

    // Manage counter
    await counter(guildDB, userDB, message);
  },
};

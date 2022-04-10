// Dependencies
import { Guild } from 'discord.js';

// Helpers
import updatePresence from '../../helpers/updatePresence';
import dropGuild from '../../helpers/dropGuild';

// Function
export default {
  name: 'guildDelete',
  async execute(guild: Guild) {
    // Destructure client
    const { client } = guild;

    await dropGuild(guild);

    await updatePresence(client);
  },
};

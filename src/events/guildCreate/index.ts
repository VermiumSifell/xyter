// Dependencies
import { Guild } from "discord.js";

// Helpers
import updatePresence from "../../helpers/updatePresence";
import fetchGuild from "../../helpers/fetchGuild";

// Function
export default {
  name: "guildCreate",
  async execute(guild: Guild) {
    // Destructure
    const { client } = guild;

    await fetchGuild(guild);

    await updatePresence(client);
  },
};

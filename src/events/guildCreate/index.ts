// Dependencies
import { Guild } from "discord.js";

// Helpers
import updatePresence from "@helpers/updatePresence";
import fetchGuild from "@helpers/fetchGuild";

export default {
  name: "guildCreate",
  async execute(guild: Guild) {
    const { client } = guild;

    await fetchGuild(guild);
    await updatePresence(client);
  },
};

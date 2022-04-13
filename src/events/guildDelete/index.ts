// 3rd party dependencies
import { Guild } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropGuild from "@helpers/dropGuild";

export default {
  name: "guildDelete",
  async execute(guild: Guild) {
    const { client } = guild;

    await dropGuild(guild);
    await updatePresence(client);
  },
};

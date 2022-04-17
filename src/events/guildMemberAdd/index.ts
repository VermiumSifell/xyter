// 3rd party dependencies
import { GuildMember } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import fetchUser from "@helpers/fetchUser";
import logger from "@logger";
import joinMessage from "../guildMemberAdd/joinMessage";

export default {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    const { client, user, guild } = member;

    logger?.verbose(
      `New member: ${user.tag} (${user.id}) added to guild: ${guild.name} (${guild.id})`
    );

    await joinMessage.execute(member);
    await fetchUser(user, guild);
    await updatePresence(client);
  },
};

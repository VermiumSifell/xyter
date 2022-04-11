import { GuildMember } from "discord.js";
import updatePresence from "../../helpers/updatePresence";
import fetchUser from "../../helpers/fetchUser";

export default {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    const { client, user, guild } = member;

    await fetchUser(user, guild);

    await updatePresence(client);
  },
};

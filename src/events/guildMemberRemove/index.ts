// 3rd party dependencies
import { GuildMember } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropUser from "@helpers/dropUser";
import logger from "@logger";
import leaveMessage from "./leaveMessage";

export default {
  name: "guildMemberRemove",
  async execute(member: GuildMember) {
    const { client, user, guild } = member;

    logger?.verbose(
      `Removed member: ${user.tag} (${user.id}) from guild: ${guild.name} (${guild.id})`
    );

    await leaveMessage.execute(member);
    await dropUser(user, guild);
    await updatePresence(client);
  },
};

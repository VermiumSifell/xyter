// 3rd party dependencies
import { GuildMember } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropUser from "@helpers/dropUser";
import logger from "@logger";
import leaveMessage from "./leaveMessage";
import audits from "./audits";

export default {
  async execute(member: GuildMember) {
    const { client, user, guild } = member;

    logger?.silly(
      `Removed member: ${user.tag} (${user.id}) from guild: ${guild.name} (${guild.id})`
    );

    await audits.execute(member);
    await leaveMessage.execute(member);
    await dropUser(user, guild);
    await updatePresence(client);
  },
};

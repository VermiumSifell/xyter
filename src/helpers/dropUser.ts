import userSchema from "@schemas/user";

import logger from "@logger";

import { Guild, User } from "discord.js";

export default async (user: User, guild: Guild) => {
  await userSchema
    .deleteOne({ userId: user.id, guildId: guild.id })
    .then(async () => {
      logger?.verbose(`Deleted user: ${user?.id} from guild: ${guild?.id}`);
    })
    .catch(async (error) => {
      logger?.error(
        `Error deleting user: ${user?.id} from guild: ${guild?.id} - ${error}`
      );
    });
};

import users from "../database/schemas/user";

import logger from "../handlers/logger";

import { Guild, User } from "discord.js";

export default async (user: User, guild: Guild) => {
  await users
    .deleteOne({ userId: user?.id, guildId: guild?.id })
    .then(async () =>
      logger.debug(`Guild: ${guild?.id} User: ${user?.id} deleted successfully`)
    );
};

import logger from "../../../logger";
import timeouts from "../../../database/schemas/timeout";

import { Message } from "discord.js";
export default async (guildDB: any, userDB: any, message: Message) => {
  const { author, guild, content } = message;

  if (content.length < guildDB.points.minimumLength) return;

  const isTimeout = await timeouts.findOne({
    guildId: guild?.id,
    userId: author.id,
    timeoutId: "2022-03-15-17-41",
  });

  if (isTimeout) {
    return logger?.verbose(
      `User: ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) is on timeout for points`
    );
  }

  userDB.points += guildDB.points.rate;

  await userDB
    .save()
    .then(async () => {
      return logger?.verbose(
        `User: ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) points incremented`
      );
    })
    .catch(async (error: any) => {
      logger?.error(error);
    });

  await timeouts.create({
    guildId: guild?.id,
    userId: author.id,
    timeoutId: "2022-03-15-17-41",
  });

  setTimeout(async () => {
    logger?.verbose(
      `User: ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) timeout removed for points`
    );

    await timeouts.deleteOne({
      guildId: guild?.id,
      userId: author.id,
      timeoutId: "2022-03-15-17-41",
    });
  }, guildDB.points.timeout);
};

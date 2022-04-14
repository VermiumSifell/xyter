import logger from "../../../logger";
import timeouts from "../../../database/schemas/timeout";
import { Message } from "discord.js";
export default async (guildDB: any, userDB: any, message: Message) => {
  const { guild, author, content } = message;

  if (content.length < guildDB.credits.minimumLength) return;

  const isTimeout = await timeouts.findOne({
    guildId: guild?.id,
    userId: author?.id,
    timeoutId: "2022-03-15-17-42",
  });

  if (isTimeout) {
    return logger?.verbose(
      `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id}) is on timeout for credits`
    );
  }

  userDB.credits += guildDB.credits.rate;

  await userDB
    .save()
    .then(async () => {
      return logger?.verbose(
        `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id})credits incremented`
      );
    })
    .catch(async (error: any) => {
      return logger?.error(error);
    });

  await timeouts.create({
    guildId: guild?.id,
    userId: author.id,
    timeoutId: "2022-03-15-17-42",
  });

  setTimeout(async () => {
    logger?.verbose(
      `User: ${author?.tag} (${author?.id}) in guild: ${guild?.name} (${guild?.id}) timeout removed for points`
    );

    await timeouts.deleteOne({
      guildId: guild?.id,
      userId: author?.id,
      timeoutId: "2022-03-15-17-42",
    });
  }, guildDB.credits.timeout);
};

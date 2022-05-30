import logger from "../../../../logger";
import timeouts from "../../../../models/timeout";
import { Message } from "discord.js";

import fetchUser from "../../../../helpers/fetchUser";
import fetchGuild from "../../../../helpers/fetchGuild";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (guild == null) return;
    if (author.bot) return;
    if (channel?.type !== "GUILD_TEXT") return;

    const { id: guildId } = guild;
    const { id: userId } = author;

    const guildData = await fetchGuild(guild);
    const userData = await fetchUser(author, guild);

    if (content.length < guildData.credits.minimumLength) return;

    const timeoutData = {
      guildId,
      userId,
      timeoutId: "2022-04-14-13-51-00",
    };

    const timeout = await timeouts.findOne(timeoutData);

    if (timeout) {
      logger.silly(
        `User ${userId} in guild ${guildId} is on timeout 2022-04-14-13-51-00`
      );
      return;
    }

    userData.credits += guildData.credits.rate;

    await userData
      .save()
      .then(async () => {
        logger.silly(
          `User ${userId} in guild ${guildId} has ${userData.credits} credits`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error saving credits for user ${userId} in guild ${guildId}`,
          err
        );
      });

    await timeouts
      .create(timeoutData)
      .then(async () => {
        logger.silly(
          `Timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId} has been created`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error creating timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId}`,
          err
        );
      });

    setTimeout(async () => {
      await timeouts
        .deleteOne(timeoutData)
        .then(async () => {
          logger.silly(
            `Timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId} has been deleted`
          );
        })
        .catch(async (err) => {
          logger.error(
            `Error deleting timeout 2022-04-14-13-51-00 for user ${userId} in guild ${guildId}`,
            err
          );
        });
    }, guildData.credits.timeout);
  },
};

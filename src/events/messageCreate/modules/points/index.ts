import logger from "@logger";
import timeouts from "@schemas/timeout";

import fetchUser from "@helpers/fetchUser";
import fetchGuild from "@helpers/fetchGuild";

import { Message } from "discord.js";
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
      timeoutId: "2022-04-14-14-15-00",
    };

    const timeout = await timeouts.findOne(timeoutData);

    if (timeout) {
      logger.silly(
        `User ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id} is on timeout 2022-04-14-14-15-00`
      );
      return;
    }

    userData.points += guildData.points.rate;

    await userData
      .save()
      .then(async () => {
        logger.silly(
          `Successfully saved user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error saving points for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
          err
        );
      });

    logger.silly(
      `User ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) has ${userData.points} points`
    );

    await timeouts
      .create(timeoutData)
      .then(async () => {
        logger.silly(
          `Successfully created timeout for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error creating timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
          err
        );
      });

    setTimeout(async () => {
      await timeouts
        .deleteOne(timeoutData)
        .then(async () => {
          logger.silly(
            `Successfully deleted timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
          );
        })
        .catch(async (err) => {
          logger.error(
            `Error deleting timeout 2022-04-14-14-15-00 for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
            err
          );
        });
    }, guildData.points.timeout);
  },
};

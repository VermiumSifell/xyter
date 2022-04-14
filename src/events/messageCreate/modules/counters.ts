import { Message } from "discord.js";

import logger from "@logger";

import counterSchema from "@schemas/counter";

export default async (message: Message) => {
  const { guild, channel, content } = message;

  if (channel?.type !== "GUILD_TEXT") return;

  const counter = await counterSchema.findOne({
    guildId: guild?.id,
    channelId: channel.id,
  });

  if (counter === null) return;

  logger?.verbose(
    `Channel: ${channel.name} (${channel.id}) is an active counter channel`
  );

  if (content !== counter.word) {
    logger?.verbose(`Message: ${content} is not the counter word`);
    return message.delete();
  }

  logger?.verbose(`Message: ${content} is the counter word`);

  await counterSchema
    .findOneAndUpdate(
      {
        guildId: guild?.id,
        channelId: channel.id,
      },
      { $inc: { counter: 1 } }
    )
    .then(async () => {
      logger?.verbose(`Counter incremented`);
    })
    .catch(async () => {
      logger?.error(`Failed to increment counter`);
    });
};

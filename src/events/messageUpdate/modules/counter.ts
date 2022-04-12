// Dependencies
import { Message } from "discord.js";

// Models
import counterSchema from "../../../database/schemas/counter";
import logger from "../../../logger";

export default async (message: Message) => {
  const { guild, channel, author, content } = message;

  const counter = await counterSchema?.findOne({
    guildId: guild?.id,
    channelId: channel?.id,
  });

  if (counter === null) return;
  const { word } = counter;
  if (content === word) return;

  await message
    ?.delete()
    ?.then(async () => {
      await channel?.send(`${author} said **${word}**.`);
    })
    ?.catch(async (error) => {
      logger.error(new Error(error));
    });
};

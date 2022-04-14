// Dependencies
import { Message } from "discord.js";
import logger from "@logger";

// Modules
import counter from "./modules/counter";

export default {
  name: "messageUpdate",
  async execute(_oldMessage: Message, newMessage: Message) {
    const { author, guild } = newMessage;

    logger?.verbose(
      `Message update event fired by ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
    );

    if (author?.bot)
      return logger?.verbose(`Message update event fired by bot`);

    await counter(newMessage);
  },
};

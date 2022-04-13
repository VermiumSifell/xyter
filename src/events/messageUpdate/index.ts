// Dependencies
import { Message } from "discord.js";
import logger from "../../logger";

// Modules
import counter from "./modules/counter";

export default {
  name: "messageUpdate",
  async execute(oldMessage: Message, newMessage: Message) {
    const { author } = newMessage;

    logger.debug({ oldMessage, newMessage });

    if (author?.bot) return;

    await counter(newMessage);
  },
};

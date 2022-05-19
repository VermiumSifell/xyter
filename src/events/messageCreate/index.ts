import { Message } from "discord.js";
import modules from "@events/messageCreate/modules";

export default {
  async execute(message: Message) {
    await modules.credits.execute(message);
    await modules.points.execute(message);
    await modules.counters.execute(message);
  },
};

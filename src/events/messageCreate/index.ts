import { Message } from "discord.js";
import modules from "@events/messageCreate/modules";

export default {
  name: "messageCreate",
  async execute(message: Message) {
    await modules.counters.execute(message);
    await modules.points.execute(message);
    await modules.counters.execute(message);
  },
};

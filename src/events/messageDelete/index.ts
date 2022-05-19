import { Message } from "discord.js";
import audits from "@events/messageDelete/audits";
import counter from "./modules/counter";

export default {
  async execute(message: Message) {
    await audits.execute(message);
    await counter(message);
  },
};

import { Message } from "discord.js";
import audits from "@events/messageDelete/audits";

export default {
  name: "messageDelete",
  async execute(message: Message) {
    await audits.execute(message);
  },
};

import { Message } from "discord.js";
import audits from "../../events/messageDelete/audits";
import counter from "./modules/counter";
import { IEventOptions } from "../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await audits.execute(message);
  await counter(message);
};

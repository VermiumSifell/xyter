import { Message } from "discord.js";
import modules from "../../events/messageCreate/modules";

import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await modules.credits.execute(message);
  await modules.points.execute(message);
  await modules.counters.execute(message);
};

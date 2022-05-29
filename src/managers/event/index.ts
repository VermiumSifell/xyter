/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import listDir from "../../helpers/listDir";

export const register = async (client: Client) => {
  const eventNames = await listDir("src/events");
  if (!eventNames) return;

  for await (const eventName of eventNames) {
    const event = await import(`../../events/${eventName}`);
    const eventExecutor = async (...args: any[]) => event.execute(...args);
    if (!event.options?.type) return;

    switch (event.options.type) {
      case "once":
        client.once(eventName, eventExecutor);
        break;

      case "on":
        client.on(eventName, eventExecutor);
        break;
    }
  }
};

/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import listDir from "../../helpers/listDir";
import { IEvent } from "../../interfaces/Event";

export const register = async (client: Client) => {
  const eventNames = await listDir("events");
  if (!eventNames) return;

  for await (const eventName of eventNames) {
    const event: IEvent = await import(`../../events/${eventName}`);
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

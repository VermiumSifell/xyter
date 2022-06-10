/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import listDir from "../../helpers/listDir";
import { IEvent } from "../../interfaces/Event";
import logger from "../../logger";

export const register = async (client: Client) => {
  const eventNames = await listDir("plugins/events");
  if (!eventNames) return;

  for await (const eventName of eventNames) {
    const event: IEvent = await import(`../../plugins/events/${eventName}`);
    const eventExecutor = async (...args: Promise<void>[]) =>
      event.execute(...args).catch(async (err) => {
        logger.error(`${err}`);
      });
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

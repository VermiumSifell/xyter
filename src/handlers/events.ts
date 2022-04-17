import fs from "fs"; // fs
import { Client } from "discord.js"; // discord.js
import logger from "@logger";

export default async (client: Client) => {
  fs.readdir("./src/events", async (error, events) => {
    if (error) {
      return logger.error(`Error reading plugins: ${error}`);
    }

    await Promise.all(
      events.map(async (eventName) => {
        const event = await import(`../events/${eventName}`);

        logger.verbose(`Loaded event: ${eventName}`);

        if (event.once) {
          return client.once(event.default.name, async (...args) =>
            event.default.execute(...args)
          );
        }

        return client.on(event.default.name, async (...args) =>
          event.default.execute(...args)
        );
      })
    )
      .then(async () => {
        logger.debug("Successfully loaded events.");
      })
      .catch(async (err) => {
        logger.error(err);
      });
  });
};

// Dependencies
import { Client } from "discord.js";
import schedule from "node-schedule";

import logger from "@logger";

// Jobs
import shopRoles from "@root/schedules/jobs/shopRoles";

export default async (client: Client) => {
  const expression = "*/5 * * * *";

  schedule.scheduleJob(expression, async () => {
    logger.info("Running jobs.");

    await shopRoles(client)
      .then(() => {
        logger.info("Shop roles job finished.");
      })
      .catch((err) => {
        logger.error(`Shop roles job failed: ${err}`);
      });
  });
};

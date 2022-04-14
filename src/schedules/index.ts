// Dependencies
import { Client } from "discord.js";
import schedule from "node-schedule";

import logger from "@logger";

// Jobs
import shopRoles from "@root/schedules/jobs/shopRoles";

export default async (client: Client) => {
  const expression = "*/5 * * * *";

  schedule.scheduleJob(expression, async () => {
    logger?.verbose("Running shop roles job.");
    await shopRoles(client);
  });
};

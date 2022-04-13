import schedule from "node-schedule";

import logger from "../logger";
import { Client } from "discord.js";
import shopRoles from "./jobs/shopRoles";

export default async (client: Client) => {
  const expression = "*/5 * * * *";

  schedule.scheduleJob(expression, async () => {
    logger.verbose(`Checking schedules! (${expression})`);
    await shopRoles(client);
  });
  logger.info("Successfully started schedule engine!");
};

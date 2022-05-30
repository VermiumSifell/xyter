import logger from "../../logger";
import { Client } from "discord.js";

import { IJob } from "../../interfaces/Job";

import listDir from "../../helpers/listDir";

import schedule from "node-schedule";

export const start = async (client: Client) => {
  logger.info("Starting schedule manager...");

  const jobNames = await listDir("jobs");
  if (!jobNames) return logger.info("No jobs found");

  await Promise.all(
    jobNames.map(async (jobName) => {
      const job: IJob = await import(`../../jobs/shopRoles`);

      schedule.scheduleJob(job.options.schedule, async () => {
        logger.info(`Executed job ${jobName}!`);
        await job.execute(client);
      });
    })
  ).then(async () => {
    const list = schedule.scheduledJobs;
    logger.silly(list);
  });
};

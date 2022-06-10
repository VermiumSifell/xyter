// 3rd party dependencies
import mongoose from "mongoose";

// Dependencies
import logger from "../../logger";

// Configuration
import { url } from "../../config/database";

export const start = async () => {
  await mongoose
    .connect(url)
    .then(async (connection) => {
      logger.info(`Connected to database: ${connection.connection.name}`);
    })
    .catch(async (e) => {
      logger.error("Could not connect to database", e);
    });

  mongoose.connection.on("error", async (error) => {
    logger.error(`${error}`);
  });

  mongoose.connection.on("warn", async (warning) => {
    logger.warn(warning);
  });
};

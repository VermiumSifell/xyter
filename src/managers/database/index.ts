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
      throw new Error(`Error connecting to database: ${e}`);
    });

  mongoose.connection.on("error", async (error) => {
    throw new Error(`Could not connect to database: ${error}`);
  });

  mongoose.connection.on("warn", async (warning) => {
    logger.warn(warning);
  });
};

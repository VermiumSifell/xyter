// 3rd party dependencies
import mongoose from "mongoose";

// Dependencies
import logger from "@logger";

// Configuration
import { url } from "@config/database";

export default async () => {
  await mongoose.connect(url).then(async (connection) => {
    logger?.info(`Connected to database: ${connection.connection.name}`);
  });
  mongoose.connection.on("error", (error) => {
    logger?.error(error);
  });
  mongoose.connection.on("warn", (warning) => {
    logger?.warn(warning);
  });
};

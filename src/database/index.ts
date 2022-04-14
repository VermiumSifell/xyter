// 3rd party dependencies
import mongoose from "mongoose";

// Dependencies
import logger from "@logger";

// Configuration
import { url } from "@config/database";

export default async () => {
  mongoose.connect(url).then(async (connection: any) => {
    logger?.info(`Connected to database: ${connection.connection.name}`);
  });
  mongoose.connection.on("error", (error: any) => {
    logger?.error(error);
  });
  mongoose.connection.on("warn", (warning: any) => {
    logger?.warn(warning);
  });
};

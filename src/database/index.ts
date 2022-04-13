// 3rd party dependencies
import mongoose from "mongoose";

// Dependencies
import logger from "@logger";

// Configuration
import { url } from "@config/database";

export default async () => {
  await mongoose
    .connect(url)
    ?.then(async () => {
      logger.info("Successfully connected to MongoDB!");
    })
    ?.catch(async () => {
      logger.error("Error whilst connecting to MongoDB!");
    });
};

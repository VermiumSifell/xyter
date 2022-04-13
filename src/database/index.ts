import { url } from "@config/database";

import mongoose from "mongoose";
import logger from "@logger";

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

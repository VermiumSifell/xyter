import mongoose from "mongoose";

import { mongodb } from "../../config.json";
import logger from "../logger";

export default async () => {
  await mongoose
    .connect(mongodb?.url)
    ?.then(async () => {
      logger.info("Successfully connected to MongoDB!");
    })
    ?.catch(async () => {
      logger.error("Error whilst connecting to MongoDB!");
    });
};

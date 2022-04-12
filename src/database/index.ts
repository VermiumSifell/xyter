import mongoose from "mongoose";

import { mongodb } from "../../config.json";
import logger from "../logger";

export default async () => {
  await mongoose
    .connect(mongodb?.url)
    ?.then(async () => {
      logger.database.info("Successfully connected!");
    })
    ?.catch(async () => {
      logger.database.error("Error whilst connecting!");
    });
};

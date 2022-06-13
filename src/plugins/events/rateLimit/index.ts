// Dependencies
import { Client } from "discord.js";
import logger from "../../../logger";

// Helpers
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (client: Client) => {
  logger.warn("Discord's API client is rate-limited!");
};

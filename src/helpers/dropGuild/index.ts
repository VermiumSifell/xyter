import guildSchema from "../../models/guild";
import userSchema from "../../models/user";
import apiSchema from "../../models/api";
import counterSchema from "../../models/counter";
import shopRoleSchema from "../../models/shopRole";
import timeoutSchema from "../../models/timeout";

import logger from "../../logger";

import { Snowflake } from "discord.js";

export default async (id: Snowflake) => {
  await guildSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      return logger?.silly(`Deleted guild: ${id}`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting guild: ${id} - ${error}`);
    });

  await userSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      logger?.silly(`Deleted users for guild: ${id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting users for guild: ${id} - ${error}`);
    });

  await apiSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      logger?.silly(`Deleted apis for guild: ${id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting apis for guild: ${id} - ${error}`);
    });

  await counterSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      logger?.silly(`Deleted counters for guild: ${id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting counters for guild: ${id} - ${error}`);
    });

  await shopRoleSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      logger?.silly(`Deleted shop roles for guild: ${id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting shop roles for guild: ${id} - ${error}`);
    });

  await timeoutSchema
    .deleteMany({ guildId: id })
    .then(async () => {
      logger?.silly(`Deleted timeouts for guild: ${id} from database`);
    })
    .catch(async (error) => {
      logger?.error(`Error deleting timeouts for guild: ${id} - ${error}`);
    });
};

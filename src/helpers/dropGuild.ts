import guilds from "../database/schemas/guild";
import users from "../database/schemas/user";
import apis from "../database/schemas/api";
import counters from "../database/schemas/counter";
import shopRoles from "../database/schemas/shopRole";
import timeouts from "../database/schemas/timeout";

import logger from "../logger";

import { Guild } from "discord.js";

export default async (guild: Guild) => {
  guilds
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id} ${e}`);
    });
  users
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}'s users`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id}'s users ${e}`);
    });
  apis
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}'s apis`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id}'s apis ${e}`);
    });
  counters
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}'s counters`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id}'s counters ${e}`);
    });
  shopRoles
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}'s shop roles`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id}'s shop roles ${e}`);
    });
  timeouts
    .deleteMany({ guildId: guild.id })
    .then(async () => {
      logger.debug(`Successfully deleted guild: ${guild.id}'s timeouts`);
    })
    .catch(async (e) => {
      logger.error(`Failed to delete guild: ${guild.id}'s timeouts ${e}`);
    });
};

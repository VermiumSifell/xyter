import { Client, Guild } from "discord.js";
import logger from "../../logger";
import dropGuild from "../../helpers/dropGuild";
import fetchGuild from "../../helpers/fetchGuild";

import guildSchema from "../../models/guild";

export const options = {
  schedule: "*/5 * * * * *", // https://crontab.guru/
};

export const execute = async (client: Client) => {
  const guildsDB = await guildSchema.find();
  const guildsDiscord = client.guilds.cache;

  const shouldNotExist = guildsDB
    .filter((x) => !guildsDiscord.some((y) => y.id === x.guildId))
    .map((z) => z.guildId);

  const shouldExist = guildsDiscord
    .filter((x) => !guildsDB.some((y) => y.guildId === x.id))
    .map((z) => z.id);

  logger.silly(shouldNotExist);
  logger.silly(shouldExist);

  if (shouldNotExist) {
    shouldNotExist.map(async (x) => {
      await dropGuild(x);
    });
  }

  if (shouldExist) {
    shouldExist.map(async (x) => {
      await fetchGuild(x);
    });
  }
};

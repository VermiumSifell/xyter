import { Guild } from "discord.js";
import updatePresence from "../../../helpers/updatePresence";
import fetchGuild from "../../../helpers/fetchGuild";
import logger from "../../../logger";
import { IEventOptions } from "../../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  if (!client.user)
    throw new Error("Discord API client user is not available.");

  logger.silly(
    `${client.user.username} joined guild: ${guild.name} (${guild.id})`
  );

  await fetchGuild(guild.id);
  await updatePresence(client);
};

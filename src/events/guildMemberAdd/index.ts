// 3rd party dependencies
import { GuildMember } from "discord.js";
import prisma from "../../handlers/database";
import updatePresence from "../../handlers/updatePresence";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import audits from "./audits";
import joinMessage from "./joinMessage";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (member: GuildMember) => {
  const { client, user, guild } = member;

  logger.silly(
    `New member: ${user.tag} (${user.id}) added to guild: ${guild.name} (${guild.id})`
  );

  await audits.execute(member);
  await joinMessage.execute(member);
  updatePresence(client);

  // Create guildMember object
  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: user.id,
          },
          where: {
            id: user.id,
          },
        },
      },
      guild: {
        connectOrCreate: {
          create: {
            id: guild.id,
          },
          where: {
            id: guild.id,
          },
        },
      },
    },
  });

  logger.silly(createGuildMember);
};

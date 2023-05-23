import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";
import logger from "../../../middlewares/logger";
import validateTransaction from "../validateTransaction";

export default async (guild: Guild, user: User, amount: number) => {
  try {
    logger.debug(
      `Starting transaction for guild: ${guild.id}, user: ${user.id}`
    );

    await validateTransaction(guild, user, amount);
    logger.debug(
      `Transaction validated for guild: ${guild.id}, user: ${user.id}`
    );

    await prisma.$transaction(async (tx) => {
      logger.debug(
        `Upserting guildMemberCredit for guild: ${guild.id}, user: ${user.id}`
      );

      const recipient = await tx.guildMemberCredit.upsert({
        update: {
          balance: {
            decrement: amount,
          },
        },
        create: {
          guildMember: {
            connectOrCreate: {
              create: {
                user: {
                  connectOrCreate: {
                    create: { id: user.id },
                    where: { id: user.id },
                  },
                },
                guild: {
                  connectOrCreate: {
                    create: { id: guild.id },
                    where: { id: guild.id },
                  },
                },
              },
              where: { guildId_userId: { guildId: guild.id, userId: user.id } },
            },
          },
          balance: -amount,
        },
        where: {
          guildId_userId: {
            guildId: guild.id,
            userId: user.id,
          },
        },
      });

      if (recipient.balance >= 2147483647) {
        throw new Error(
          "Oops! That's more credits than the user can have. The maximum allowed is 2,147,483,647."
        );
      }

      if (recipient.balance < 0) {
        logger.warn(
          `Insufficient credits for guild: ${guild.id}, user: ${user.id}`
        );
        throw new Error("User does not have enough credits.");
      }

      logger.debug(
        `Transaction completed for guild: ${guild.id}, user: ${user.id}`
      );

      return recipient;
    });
  } catch (error: any) {
    logger.error(
      `Error in transaction for guild: ${guild.id}, user: ${user.id}: ${error.message}`
    );
    throw error;
  }
};

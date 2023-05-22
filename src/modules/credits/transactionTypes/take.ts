import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";
import validateTransaction from "../validateTransaction";

export default async (guild: Guild, user: User, amount: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if the transaction is valid.
    validateTransaction(guild, user, amount);

    // 2. Make the transaction.
    const recipient = await tx.guildMemberCredit.upsert({
      update: {
        balance: {
          decrement: amount,
        },
      },
      create: {
        GuildMember: {
          connectOrCreate: {
            create: {
              User: {
                connectOrCreate: {
                  create: { id: user.id },
                  where: { id: user.id },
                },
              },
              Guild: {
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

    // 3. Verify that the recipient credits are not below zero.
    if (recipient.balance < -100)
      throw new Error("User do not have enough credits");

    // 4. Return the recipient.
    return recipient;
  });
};

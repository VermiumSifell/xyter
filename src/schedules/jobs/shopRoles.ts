// Dependencies
import { Client } from "discord.js";

import logger from "@logger";

// Schemas
import userSchema from "@schemas/user";
import shopRoleSchema from "@schemas/shopRole";
import guildSchema from "@schemas/guild";

export default async (client: Client) => {
  const roles = await shopRoleSchema.find();

  await Promise.all(
    roles.map(async (role) => {
      const { guildId, userId, roleId } = role;

      const lastPayment = new Date(role.lastPayed);

      const nextPayment = new Date(
        lastPayment.setHours(lastPayment.getHours() + 1)
      );

      if (new Date() < nextPayment) {
        logger.silly(`Shop role ${roleId} is not due for payment.`);
      }

      const guildData = await guildSchema.findOne({ guildId });

      if (!guildData) {
        logger.error(`Guild ${guildId} not found.`);
        return;
      }

      if (!userId) {
        logger.error(`User ID not found for shop role ${roleId}.`);
        return;
      }

      const userData = await userSchema.findOne({ guildId, userId });

      if (!userData) {
        logger.error(`User ${userId} not found for shop role ${roleId}.`);
        return;
      }

      const rGuild = client?.guilds?.cache?.get(guildId);

      const rMember = await rGuild?.members?.fetch(userId);

      if (!rMember) {
        logger.error(`Member ${userId} not found for shop role ${roleId}.`);
        return;
      }

      const rRole = rMember.roles.cache.get(roleId);

      if (!rRole) {
        logger.error(`Role ${roleId} not found for shop role ${roleId}.`);
        return;
      }

      if (!rMember) {
        logger.error(`Member ${userId} not found for shop role ${roleId}.`);
        return;
      }

      if (new Date() > nextPayment) {
        logger.verbose(
          `Shop role ${roleId} is due for payment. Withdrawing credits from user ${userId}.`
        );

        const { pricePerHour } = guildData.shop.roles;

        if (userData.credits < pricePerHour) {
          logger.error(
            `User ${userId} does not have enough credits to pay for shop role ${roleId}.`
          );

          if (!rMember) {
            logger.error(`Member ${userId} not found for shop role ${roleId}.`);
            return;
          }

          rMember.roles.remove(roleId);

          return;
        }

        userData.credits -= pricePerHour;

        await userData
          .save()
          .then(async () => {
            role.lastPayed = new Date();

            await role
              .save()
              .then(async () => {
                logger.verbose(`Shop role ${roleId} has been paid for.`);
              })
              .catch(async (err) => {
                logger.error(
                  `Error saving shop role ${roleId} last payed date.`,
                  err
                );
              });

            logger.verbose(
              `Shop role ${roleId} has been paid for. Keeping role ${roleId} for user ${userId}.`
            );
          })
          .catch(async (err) => {
            logger.error(
              `Error saving user ${userId} credits for shop role ${roleId}.`,
              err
            );
          });
      }
    })
  );
};

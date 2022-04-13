// Dependencies
import { Client } from "discord.js";

import logger from "@logger";

// Schemas
import userSchema from "@schemas/user";
import shopRoleSchema from "@schemas/shopRole";
import guildSchema from "@schemas/guild";

export default async (client: Client) => {
  await shopRoleSchema?.find()?.then(async (shopRoles: any) => {
    shopRoles?.map(async (shopRole: any) => {
      const payed = new Date(shopRole?.lastPayed);

      const oneHourAfterPayed = payed?.setHours(payed?.getHours() + 1);

      if (new Date() > new Date(oneHourAfterPayed)) {
        logger.debug(
          `Role: ${shopRole?.roleId} Expires: ${
            new Date() < new Date(oneHourAfterPayed)
          } Last Payed: ${shopRole?.lastPayed}`
        );

        // Get guild object
        const guild = await guildSchema?.findOne({
          guildId: shopRole?.guildId,
        });

        if (guild === null) return;
        const userDB = await userSchema?.findOne({
          userId: shopRole?.userId,
          guildId: shopRole?.guildId,
        });
        const { pricePerHour } = guild.shop.roles;

        if (userDB === null) return;

        if (userDB?.credits < pricePerHour) {
          const rGuild = client?.guilds?.cache?.get(`${shopRole?.guildId}`);
          const rMember = await rGuild?.members?.fetch(`${shopRole?.userId}`);

          shopRoleSchema
            ?.deleteOne({ _id: shopRole?._id })
            ?.then(async () =>
              logger?.debug(`Removed ${shopRole?._id} from collection.`)
            );

          return rMember?.roles?.remove(`${shopRole?.roleId}`);
        }

        shopRole.lastPayed = new Date();
        shopRole?.save()?.then(async () => {
          userDB.credits -= pricePerHour;
          userDB?.save();
        });
      }
    });
  });
};

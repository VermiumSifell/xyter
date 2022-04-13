import { Client } from "discord.js";

import logger from "../../logger";

import users from "../../database/schemas/user";
import shopRoleSchema from "../../database/schemas/shopRole";
import guilds from "../../database/schemas/guild";

export default async (client: Client) => {
  shopRoleSchema.find().then(async (shopRoles: any) => {
    shopRoles.map(async (shopRole: any) => {
      const payed = new Date(shopRole?.lastPayed);

      const oneHourAfterPayed = payed?.setHours(payed?.getHours() + 1);

      if (new Date() > new Date(oneHourAfterPayed)) {
        logger.debug(
          `Role: ${shopRole?.roleId} Expires: ${
            new Date() < new Date(oneHourAfterPayed)
          } Last Payed: ${shopRole?.lastPayed}`
        );

        // Get guild object
        const guild = await guilds?.findOne({
          guildId: shopRole?.guildId,
        });

        if (guild === null) return;
        const userDB = await users?.findOne({
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
              logger?.verbose(`Removed ${shopRole?._id} from collection.`)
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

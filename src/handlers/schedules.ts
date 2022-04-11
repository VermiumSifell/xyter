import schedule from "node-schedule";
import users from "../helpers/database/models/userSchema";
import shopRolesSchema from "../helpers/database/models/shopRolesSchema";
import guilds from "../helpers/database/models/guildSchema";
import logger from "./logger";
import { Client } from "discord.js";

export default async (client: Client) => {
  schedule.scheduleJob("*/5 * * * *", async () => {
    shopRolesSchema.find().then(async (shopRoles: any) => {
      shopRoles.map(async (shopRole: any) => {
        const payed = new Date(shopRole.lastPayed);

        const oneHourAfterPayed = payed.setHours(payed.getHours() + 1);

        if (new Date() > new Date(oneHourAfterPayed)) {
          logger.debug(
            `Role: ${shopRole.roleId} Expires: ${
              new Date() < new Date(oneHourAfterPayed)
            } Last Payed: ${shopRole.lastPayed}`
          );

          // Get guild object
          const guild = await guilds.findOne({
            guildId: shopRole.guildId,
          });

          const userDB = await users.findOne({
            userId: shopRole.userId,
            guildId: shopRole.guildId,
          });
          const { pricePerHour } = guild.shop.roles;

          if (userDB === null) return;

          if (userDB.credits < pricePerHour) {
            const rGuild = client?.guilds?.cache?.get(`${shopRole.guildId}`);
            const rMember = await rGuild?.members?.fetch(`${shopRole.userId}`);

            shopRolesSchema
              .deleteOne({ _id: shopRole._id })
              .then(async () =>
                logger.debug(`Removed ${shopRole._id} from shopRoles`)
              );

            return await rMember?.roles
              .remove(`${shopRole.roleId}`)
              .then(async (test) => console.log("4", test))
              .catch(async (test) => console.log("5", test)); // Removes all roles
          }

          shopRole.lastPayed = new Date();
          shopRole.save();
          userDB.credits -= pricePerHour;
          userDB.save();
          await logger.debug(
            `${shopRole.roleId} was payed one hour later. BEFORE: ${payed} AFTER: ${oneHourAfterPayed} UPDATED: ${shopRole.updatedAt} CREATED: ${shopRole.createdAt}`
          );
        }
      });
    });

    await logger.debug("Checking schedules! (Every 5 minutes)");
  });
};

// Dependencies
import { Guild, User } from "discord.js";

// Models
import userSchema from "../database/schemas/user";

// Handlers
import logger from "../logger";

// Function
export default async (user: User, guild: Guild) => {
  const userObj = await userSchema?.findOne({
    userId: user.id,
    guildId: guild.id,
  });
  if (userObj === null) {
    const newUserObj = new userSchema({
      userId: user.id,
      guildId: guild.id,
    });

    await newUserObj
      .save()
      .then(async () => {
        logger.debug(
          `Member: ${user.id} has successfully been added to the database.`
        );
      })
      .catch(async (err: any) => {
        logger.error(err);
      });

    return newUserObj;
  } else {
    return userObj;
  }
};

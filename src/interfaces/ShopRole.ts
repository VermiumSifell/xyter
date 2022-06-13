import { Snowflake } from "discord.js";
import { Document } from "mongoose";

export interface IShopRole extends Document {
  guildId: Snowflake;
  userId: Snowflake;
  roleId: Snowflake;
  lastPayed: Date;
}

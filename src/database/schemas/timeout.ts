import { Snowflake } from "discord.js";
import { Schema, model } from "mongoose";

export interface ITimeout {
  userId: Snowflake;
  guildId: Snowflake;
  timeoutId: string;
}

const timeoutSchema = new Schema<ITimeout>(
  {
    userId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    guildId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    timeoutId: { type: String },
  },
  { timestamps: true }
);

export default model<ITimeout>("timeout", timeoutSchema);

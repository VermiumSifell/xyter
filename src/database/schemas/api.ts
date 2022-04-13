import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";

export interface IApi {
  guildId: Snowflake;
  url: string;
  token: { iv: string; content: string };
}

const apiSchema = new Schema<IApi>(
  {
    guildId: {
      type: String,
      required: true,
      unique: false,
      index: true,
    },
    url: {
      type: String,
      required: true,
      unique: false,
      index: true,
      default: "https://localhost/api/",
    },
    token: {
      iv: {
        type: String,
        required: true,
        unique: false,
        index: true,
        default: "token",
      },
      content: {
        type: String,
        required: true,
        unique: false,
        index: true,
        default: "token",
      },
    },
  },
  { timestamps: true }
);

export default model<IApi>("api", apiSchema);

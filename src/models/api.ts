import { Snowflake } from "discord.js";
import { model, Schema } from "mongoose";
import { IEncryptionData } from "../interfaces/EncryptionData";

export interface IApi {
  guildId: Snowflake;
  url: IEncryptionData;
  token: IEncryptionData;
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
      iv: {
        type: String,
        required: true,
        unique: false,
        index: true,
      },
      content: {
        type: String,
        required: true,
        unique: false,
        index: true,
      },
    },
    token: {
      iv: {
        type: String,
        required: true,
        unique: false,
        index: true,
      },
      content: {
        type: String,
        required: true,
        unique: false,
        index: true,
      },
    },
  },
  { timestamps: true }
);

export default model<IApi>("api", apiSchema);

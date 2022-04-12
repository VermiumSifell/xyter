import { Schema, model } from "mongoose";

interface IGuild {
  guildId: string;
  credits: {
    status: boolean;
    rate: number;
    timeout: number;
    workRate: number;
    minimumLength: number;
    workTimeout: number;
  };
  shop: { roles: { status: boolean; pricePerHour: number } };
  points: {
    status: boolean;
    rate: number;
    minimumLength: number;
    timeout: number;
  };
}

const guildSchema = new Schema<IGuild>(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    credits: {
      status: {
        type: Boolean,
        default: true,
      },
      rate: {
        type: Number,
        default: 1,
      },
      minimumLength: {
        type: Number,
        default: 5,
      },
      timeout: {
        type: Number,
        default: 5000,
      },
      workRate: {
        type: Number,
        default: 15,
      },
      workTimeout: {
        type: Number,
        default: 900000,
      },
    },
    shop: {
      roles: {
        status: {
          type: Boolean,
          default: true,
        },
        pricePerHour: {
          type: Number,
          default: 5,
        },
      },
    },
    points: {
      status: {
        type: Boolean,
        default: false,
      },
      rate: {
        type: Number,
        default: 1,
      },
      minimumLength: {
        type: Number,
        default: 5,
      },
      timeout: {
        type: Number,
        default: 5000,
      },
    },
  },
  { timestamps: true }
);

export default model<IGuild>("guild", guildSchema);

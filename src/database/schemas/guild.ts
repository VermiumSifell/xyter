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
  welcome: {
    status: boolean;
    joinChannel: string;
    leaveChannel: string;
    joinChannelMessage: string;
    leaveChannelMessage: string;
  };
  audits: { status: boolean; channelId: string };
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
          default: false,
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
    welcome: {
      status: {
        type: Boolean,
        default: false,
      },
      joinChannel: { type: String },
      leaveChannel: { type: String },
      joinChannelMessage: { type: String },
      leaveChannelMessage: { type: String },
    },
    audits: {
      status: { type: Boolean, default: false },
      channelId: { type: String },
    },
  },
  { timestamps: true }
);

export default model<IGuild>("guild", guildSchema);

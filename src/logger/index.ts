import winston from "winston";
import "winston-daily-rotate-file";

import { logLevel } from "../config/other";

const { combine, timestamp, printf, errors, colorize, align, json } =
  winston.format;

export default winston.createLogger({
  level: logLevel || "info",
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(timestamp(), json()),
    }),
    new winston.transports.Console({
      format: combine(
        errors({ stack: true, trace: true }), // <-- use errors format
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:MM:ss",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
  ],
});

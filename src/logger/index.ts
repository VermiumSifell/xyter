import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, align, json, label } =
  winston.format;

export default {
  database: winston.createLogger({
    level: process.env.LOG_LEVEL || "silly",
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "logs/database-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
        format: combine(timestamp(), json()),
      }),
      new winston.transports.Console({
        format: combine(
          label({ label: "[Database]" }),
          colorize({ all: true }),
          timestamp({
            format: "YYYY-MM-DD HH:MM:ss",
          }),
          align(),
          printf(
            (info) =>
              `[${info.timestamp}] ${info.label} ${info.level}: ${info.message}`
          )
        ),
      }),
    ],
  }),
};

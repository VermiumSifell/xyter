import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, align, json } = winston.format;

module.exports = {
  // Logger initialized async-hronously
  logger: async () => {
    return winston.createLogger({
      level: process.env.LOG_LEVEL || "silly",
      transports: [
        new winston.transports.DailyRotateFile({
          filename: "logs/combined-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "14d",
          format: combine(timestamp(), json()),
        }),
        new winston.transports.Console({
          format: combine(
            colorize({ all: true }),
            timestamp({
              format: "YYYY-MM-DD HH:MM:ss",
            }),
            align(),
            printf(
              (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
            )
          ),
        }),
      ],
    });
  },
};

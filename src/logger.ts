import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// eslint-disable-next-line no-console
console.log("Starting the logger...");

const directory = path.resolve(__dirname, "logs");

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.json(),
    logFormat
  ),
  transports: [
    new DailyRotateFile({ filename: "log-%DATE%", datePattern: "YYYYMMDD", dirname: directory, maxFiles: 14, utc: true, extension: ".txt" }),
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
      level: "debug",
    }),
  ],
});

logger.info("Logger started");

export default logger;

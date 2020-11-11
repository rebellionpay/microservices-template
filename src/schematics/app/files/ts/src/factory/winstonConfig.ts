import { format, transports, addColors, LoggerOptions } from "winston";
import { MESSAGE } from 'triple-beam';
import * as dotenv from 'dotenv';

dotenv.config();
export class LoggerConfig {
  private readonly options: LoggerOptions;

  private static instance: LoggerConfig;
 
  public static getInstance(): LoggerConfig {
    if (!LoggerConfig.instance) {
      LoggerConfig.instance = new LoggerConfig();
    }

    return LoggerConfig.instance;
  }

  private defaultFormat() {
    return format.combine(
      format.timestamp(),
      format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label']
      })
    );
  }

  private stagingFormat() {
    return format.combine(
      this.defaultFormat(),
      format.colorize(),
      format.printf((info) => {
        const reqId = info.metadata.reqId;
        delete info.metadata.reqId;

        return (`${info.level} | ${info.timestamp} ${reqId ? `| ${reqId}` : ''} | ${info.message} | ${JSON.stringify(info.metadata)}`);
      })
    );
  }

  private productionFormat() {
    return format.combine(
      this.defaultFormat(),
      format((info) => {
        const reqId = info.metadata.reqId;
        delete info.metadata.reqId;

        info.reqId = reqId;

        if (typeof info.message === 'object' && info.message !== null) {
          info.message = JSON.stringify(info.message);
        }

        const { level, timestamp, label } = info;

        const message = {
          level,
          timestamp,
          label,
          reqId,
          metadata: info.metadata,
          message: info.message
        };

        delete info.metadata;
        delete info.message;
        delete info.level;
        delete info.timestamp;
        delete info.label;

        info[MESSAGE] = JSON.stringify(message);

        return info;
      })()
    );
  }

  constructor() {
    this.options = {
      format: process.env.NODE_ENV === 'production' ? this.productionFormat() : this.stagingFormat(),
      transports: [
        new transports.Console({
          level: 'silly', // TODO: Get value from configfile 
        })
      ],
      exitOnError: false // do not exit on handled exceptions
    };
  }

  public console(): LoggerOptions {
    return this.options;
  }
}

addColors({
  error: 'bold green redBG',
  warn: 'italic black yellowBG',
  info: 'cyan',
  http: 'grey',
  verbose: 'magenta',
  debug: 'green',
  silly: 'bold gray magentaBG'
});
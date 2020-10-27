import { format, transports, addColors,LoggerOptions } from "winston";
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

  private stagingFormat() {
    return format.combine(
      format.colorize(),
      format.timestamp(),
      format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label']
      }),
      format.printf((info) => {
        if(typeof info.message === 'object') {
          info.message = JSON.stringify(info.message);
        }

        const reqId = info.metadata.reqId;
        delete info.metadata.reqId;

        return (`${info.level} | ${info.timestamp} ${reqId ? `| ${reqId}` : ''} | ${info.message} | ${JSON.stringify(info.metadata)}`);
      })
    );
  }

  constructor() {
    this.options = {
      format: process.env.NODE_ENV === 'production' ? format.logstash() : this.stagingFormat(),
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
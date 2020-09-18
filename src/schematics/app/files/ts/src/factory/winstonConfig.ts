import { format, transports, addColors,LoggerOptions } from "winston";

export class LoggerConfig {
  private readonly options: LoggerOptions;

  private static stringifyInfo(info) {
    if (!info) return '';
    return info.reduce((acc, val) => acc + ' | ' + (typeof val === 'string' ? val : JSON.stringify(val)), '');
  };


  private static formatRequest(value) {
    if (!value) return null;
    return `${value.reqId} | ${value.path || ''} ${value.user ? ` | user:${value.user}` : ''}`;
  }

  constructor() {
    this.options = {
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((info) => {
          const sym: symbol = Object.getOwnPropertySymbols(info).find((e) => Symbol.keyFor(e) === 'splat');
          const extraInfo = info[sym as any];
          let requestInfo;
          if (extraInfo) {
            const index = extraInfo.findIndex((obj) => obj && obj.reqId);
            if (index !== -1) {
              requestInfo = LoggerConfig.formatRequest(extraInfo[index]);
              extraInfo.splice(index, 1);
            }
          }
          return (`${info.level} | ${info.timestamp} ${requestInfo ? `| ${requestInfo}` : ''} | ${info.message} ${LoggerConfig.stringifyInfo(extraInfo)}`);
        })
      ),
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
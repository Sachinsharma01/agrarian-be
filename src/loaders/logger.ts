import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import config from '../config';

const transports = [];

const logTail = new Logtail(config.logTailToken);
if (process.env.ENV !== 'development') {
  transports.push(new LogtailTransport(logTail));
}

transports.push(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.cli(), winston.format.splat()),
  }),
);

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export default LoggerInstance;

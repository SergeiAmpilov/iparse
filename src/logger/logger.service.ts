import { Logger, ILogObj } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';


@injectable()
export class LoggerService implements ILogger {

  public logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      type: 'pretty'
    });
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }

}
import { inject, injectable } from "inversify";
import { IConfigService } from "./config.service.interface";
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {

  private config: DotenvParseOutput;

  constructor(
    @inject(TYPES.ILogger) private readonly loggerService: ILogger,
  ) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      loggerService.error('Cannot read .env config file', result.error);
    } else {
      this.config = result.parsed as DotenvParseOutput;
    }

  }
  
  get<T extends string | number>(key: string): T {
    return this.config[key] as T;
  };

}
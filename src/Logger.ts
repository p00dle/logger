import { consoleLogConsumerFactory } from './consumers/console';
import { LogConsumer, LogLevel, LogMessage } from './interfaces';

const logLevelNumbers: { [logLevel: string]: number } = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

export interface LoggerOptions<T = Error | string> {
  consumer: LogConsumer<T>;
  logLevel: LogLevel;
  logNamespace: string;
}

const defaultLoggerOptions: LoggerOptions<Error | string> = {
  consumer: consoleLogConsumerFactory(),
  logLevel: 'info',
  logNamespace: '',
};

export class Logger<T = string | Error> {
  private consumer: LogConsumer<T>;
  private logLevel: LogLevel;
  private logNamespace: string;
  private logLevelNumber: number;

  constructor(options?: Partial<LoggerOptions<T>>) {
    const { consumer, logLevel, logNamespace } = options
      ? { ...defaultLoggerOptions, ...options }
      : defaultLoggerOptions;
    this.consumer = consumer as LogConsumer<T>;
    this.logLevel = logLevel;
    this.logNamespace = logNamespace;
    this.logLevelNumber = logLevelNumbers[logLevel];
  }
  public debug = (payload: T) => this.send(0, 'debug', payload);
  public info = (payload: T) => this.send(1, 'info', payload);
  public warn = (payload: T) => this.send(2, 'warn', payload);
  public error = (payload: T) => this.send(3, 'error', payload);
  public namespace(logNamespace: string): Logger<T> {
    return new Logger({
      consumer: this.consumer,
      logLevel: this.logLevel,
      logNamespace: this.logNamespace ? `${this.logNamespace}.${logNamespace}` : logNamespace,
    });
  }
  private send(logLevelNumber: number, logLevel: Exclude<LogLevel, 'silent'>, payload: T): void {
    if (logLevelNumber < this.logLevelNumber) {
      return;
    }
    const timestamp = Date.now();
    const namespace = this.logNamespace;
    const message: LogMessage<T> = { namespace, timestamp, logLevel, payload };
    this.consumer(message);
  }
}

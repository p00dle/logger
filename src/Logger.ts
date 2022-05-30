import { consoleLogConsumerFactory } from './consumers/console';
import { LogConsumer, LogLevel, LogMessage } from './interfaces';

const logLevelNumbers: { [logLevel: string]: number } = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

export interface LoggerOptions<T = Error | string, I extends any[] = [T]> {
  consumer: LogConsumer<T>;
  logLevel: LogLevel;
  logNamespace: string;
  transformer?: Transformer<I, T>;
}

type Transformer<I extends any[], O> = (...args: I) => O;

const defaultLoggerOptions: LoggerOptions<Error | string> = {
  consumer: consoleLogConsumerFactory(),
  logLevel: 'info',
  logNamespace: '',
  transformer: (id) => id,
};

export class Logger<T = string | Error, I extends any[] = [T]> {
  private consumer: LogConsumer<T>;
  private logLevel: LogLevel;
  private logNamespace: string;
  private logLevelNumber: number;
  private transformer: Transformer<I, T>;

  constructor(options?: Partial<LoggerOptions<T, I>>) {
    const { consumer, logLevel, logNamespace, transformer } = options
      ? { ...defaultLoggerOptions, ...options }
      : defaultLoggerOptions;
    this.consumer = consumer as LogConsumer<T>;
    this.logLevel = logLevel;
    this.logNamespace = logNamespace;
    this.logLevelNumber = logLevelNumbers[logLevel];
    this.transformer = transformer as Transformer<I, T>;
  }
  public debug = (...payload: I) => this.send(0, 'debug', ...payload);
  public info = (...payload: I) => this.send(1, 'info', ...payload);
  public warn = (...payload: I) => this.send(2, 'warn', ...payload);
  public error = (...payload: I) => this.send(3, 'error', ...payload);

  public namespace<I extends any[]>(logNamespace: string, transformer?: Transformer<I, T>): Logger<T, I> {
    return new Logger({
      consumer: this.consumer,
      logLevel: this.logLevel,
      logNamespace: this.logNamespace ? `${this.logNamespace}.${logNamespace}` : logNamespace,
      transformer: transformer || (this.transformer as unknown as Transformer<I, T>),
    });
  }
  private send(logLevelNumber: number, logLevel: Exclude<LogLevel, 'silent'>, ...payload: I): void {
    if (logLevelNumber < this.logLevelNumber) {
      return;
    }
    const timestamp = Date.now();
    const namespace = this.logNamespace;
    const transformedPayload = this.transformer(...payload);
    const message: LogMessage<T> = { namespace, timestamp, logLevel, payload: transformedPayload };
    this.consumer(message);
  }
}

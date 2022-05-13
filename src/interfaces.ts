export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogMessage<T = string | Error> {
  namespace: string;
  timestamp: number;
  logLevel: Exclude<LogLevel, 'silent'>;
  payload: T;
}

export type LogConsumer<T = string | Error> = (msg: LogMessage<T>) => any;

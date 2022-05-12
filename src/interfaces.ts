export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogMessage<T = string> {
  namespace: string;
  timestamp: number;
  logLevel: Exclude<LogLevel, 'silent'>;
  payload: T;
}

export type LogConsumer<T = string> = (msg: LogMessage<T>) => any;

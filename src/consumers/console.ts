import { LogConsumer, LogLevel } from '../interfaces';
import { getTimestampText } from '../lib/get-timestamp-text';

const logColors: Record<LogLevel, string> = {
  debug: '\x1b[37m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  silent: '',
};

function stringifyPayload(payload: string | Error): string {
  return payload instanceof Error ? (payload.stack as string) : payload;
}

export interface ConsoleLike {
  debug: (str: string) => void;
  info: (str: string) => void;
  warn: (str: string) => void;
  error: (str: string) => void;
}

export interface ConsoleLogConsumerOptions {
  useColors: boolean;
  useTimestamp: boolean;
  useLogLevel: boolean;
  useNamespace: boolean;
  useUTC: boolean;
  console: ConsoleLike;
}

const defaultOptions: ConsoleLogConsumerOptions = {
  useColors: true,
  useTimestamp: true,
  useLogLevel: true,
  useNamespace: true,
  useUTC: true,
  console,
};

export function consoleLogConsumerFactory(options?: Partial<ConsoleLogConsumerOptions>): LogConsumer<string | Error> {
  const { useColors, useTimestamp, useLogLevel, useNamespace, useUTC, console } = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;
  return ({ namespace, timestamp, logLevel, payload }) => {
    const text = [
      useColors ? logColors[logLevel] : '',
      useTimestamp ? getTimestampText(timestamp, useUTC) : '',
      useLogLevel ? `[${logLevel.padEnd(5, ' ')}] ` : '',
      useNamespace && namespace.length > 0 ? `[${namespace}] ` : '',
      stringifyPayload(payload),
      useColors ? '\x1b[0m' : '',
    ].join('');
    console[logLevel](text);
  };
}

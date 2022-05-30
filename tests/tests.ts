import type { LogConsumer, LogMessage, LoggerOptions } from '../src';
import type { ConsoleLike } from '../src/consumers/console';
import { Logger, consoleLogConsumerFactory } from '../src';

describe('exports', () => {
  it('should export Logger class', () => expect(new Logger() instanceof Logger).toBe(true));
  it('should export consoleLoggerConsumerFactory', () => expect(typeof consoleLogConsumerFactory).toBe('function'));
});

describe('Logger', () => {
  function collectLogs(arr: LogMessage<any>[]): LogConsumer<any> {
    return (log) => arr.push(log);
  }
  it('should accept partial options and use defaults when undefined', () => {
    const options: Partial<LoggerOptions>[] = [
      { consumer: () => null },
      { logLevel: 'silent' },
      { logNamespace: 'ns' },
    ];
    for (const opts of options) {
      expect(new Logger(opts) instanceof Logger).toBe(true);
    }
  });
  it('should log using all methods', () => {
    const logs: LogMessage[] = [];
    const logger = new Logger({ consumer: collectLogs(logs), logLevel: 'debug' });
    logger.debug('debug');
    logger.info('info');
    logger.warn('warn');
    logger.error('error');
    expect(logs[0].logLevel === 'debug' && logs[0].payload === 'debug').toBe(true);
    expect(logs[1].logLevel === 'info' && logs[1].payload === 'info').toBe(true);
    expect(logs[2].logLevel === 'warn' && logs[2].payload === 'warn').toBe(true);
    expect(logs[3].logLevel === 'error' && logs[3].payload === 'error').toBe(true);
  });
  it('should log only at logLevel or above', () => {
    const debugLogs: LogMessage[] = [];
    const infoLogs: LogMessage[] = [];
    const warnLogs: LogMessage[] = [];
    const errorLogs: LogMessage[] = [];
    const silentLogs: LogMessage[] = [];
    const debugLogger = new Logger({ consumer: collectLogs(debugLogs), logLevel: 'debug' });
    const infoLogger = new Logger({ consumer: collectLogs(infoLogs), logLevel: 'info' });
    const warnLogger = new Logger({ consumer: collectLogs(warnLogs), logLevel: 'warn' });
    const errorLogger = new Logger({ consumer: collectLogs(errorLogs), logLevel: 'error' });
    const silentLogger = new Logger({ consumer: collectLogs(silentLogs), logLevel: 'silent' });
    for (const logger of [debugLogger, infoLogger, warnLogger, errorLogger, silentLogger]) {
      logger.debug('');
      logger.info('');
      logger.warn('');
      logger.error('');
    }
    expect(debugLogs.length).toBe(4);
    expect(infoLogs.length).toBe(3);
    expect(warnLogs.length).toBe(2);
    expect(errorLogs.length).toBe(1);
    expect(silentLogs.length).toBe(0);
  });
  it('should use namespace inheritance correctly', () => {
    const logs: LogMessage[] = [];
    const consumer = collectLogs(logs);
    const logger1 = new Logger({ consumer });
    const logger2 = logger1.namespace('ns1');
    const logger3 = logger2.namespace('ns2');
    logger1.info('');
    logger2.info('');
    logger3.info('');
    expect(logs[0].namespace).toBe('');
    expect(logs[1].namespace).toBe('ns1');
    expect(logs[2].namespace).toBe('ns1.ns2');
  });
  it('should use transformer when defined', () => {
    const logs: LogMessage[] = [];
    const consumer = collectLogs(logs);
    function transformer(obj: { a: number; b: number }): string {
      return '' + (obj.a + obj.b);
    }
    const logger = new Logger({ consumer, transformer });
    logger.info({ a: 1, b: 2 });

    expect(logs[0].payload).toBe('3');
  });
  it('should use transformer for subspace', () => {
    const logs: LogMessage[] = [];
    const consumer = collectLogs(logs);
    const logger = new Logger({ consumer });
    function transformer(date: Date): string {
      return '' + +date;
    }
    const subLogger = logger.namespace('dates', transformer);
    logger.info('string');
    subLogger.info(new Date(0));
    expect(logs[0].payload).toBe('string');
    expect(logs[1].payload).toBe('0');
  });
  it('allows transformer to have more than one argument', () => {
    const logs: LogMessage[] = [];
    const consumer = collectLogs(logs);
    const logger = new Logger<{ message: string; details?: string }>({ consumer });
    function transformer(message: string, details?: string): { message: string; details?: string } {
      return { message, details };
    }
    const subLogger = logger.namespace('msg', transformer);
    subLogger.info('message', 'details');
    expect(logs[0].payload).toEqual({ message: 'message', details: 'details' });
  });
});

describe('consoleLogConsumerFactory', () => {
  function consoleFactory(arr: string[]): ConsoleLike {
    return {
      debug: (str) => arr.push(str),
      info: (str) => arr.push(str),
      warn: (str) => arr.push(str),
      error: (str) => arr.push(str),
    };
  }
  it('should work with default params', () => {
    const logs: string[] = [];
    const mockConsole = consoleFactory(logs);
    const consoleLogConsumer = consoleLogConsumerFactory({ console: mockConsole });
    consoleLogConsumer({ namespace: 'NS', timestamp: Date.now(), logLevel: 'info', payload: 'log' });
    expect(logs[0]).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} UTC \[info \] \[NS\]/);
  });
  it('should use local timezone', () => {
    const logs: string[] = [];
    const mockConsole = consoleFactory(logs);
    const consoleLogConsumer = consoleLogConsumerFactory({
      console: mockConsole,
      useUTC: false,
      useColors: false,
      useLogLevel: false,
    });
    consoleLogConsumer({ namespace: '', timestamp: Date.now(), logLevel: 'warn', payload: '' });
    expect(logs[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} UTC\+\d+ $/);
  });
  it('should be able to stringify error message with trace', () => {
    const logs: string[] = [];
    const mockConsole = consoleFactory(logs);
    const consoleLogConsumer = consoleLogConsumerFactory({
      useColors: false,
      useLogLevel: false,
      useNamespace: false,
      useTimestamp: false,
      useUTC: false,
      console: mockConsole,
    });
    consoleLogConsumer({ namespace: '', timestamp: 0, logLevel: 'debug', payload: new Error('error message') });
    consoleLogConsumer({ namespace: '', timestamp: 0, logLevel: 'debug', payload: Error('error message') });
    const [errorMessage, ...traceLines] = logs[0].split(/\r*\n/);
    expect(errorMessage).toMatch(/^\s*Error: error message\s*$/);
    expect(traceLines.length > 5).toBe(true);
  });
});

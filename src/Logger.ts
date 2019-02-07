import { LogConsumer, LogLevel, LogMessage } from './interfaces';

const logLevelNumbers: {[logLevel: string]: number} = {
  debug: 0, info: 1, warn: 2, error: 3, silent: 4
};

function formatIntervalMs(num : number): string {
  let n = num;
  const ms = n % 1000;
  n = n - ms;
  const secondsMs = n % 60000;
  const seconds = secondsMs / 1000;
  n = n - secondsMs;
  const minutesMs = n % 3600000;
  const minutes = minutesMs / 60000;
  n = n - minutesMs;
  const hoursMs = n % 86400000;
  const hours = hoursMs / 3600000;
  n = n - hoursMs;
  const days = n / 86400000;
  return `${
    days > 0 ? days + 'd ' : ''
  }${
    hours > 0 ? hours + 'h ' : ''
  }${
    minutes > 0 ? minutes + 'm ' : ''
  }${
    seconds > 0 ? seconds + 's ' : ''
  }${
    ms > 0 ? ms + 'ms' : ''
  }`;

}

export class Logger<T = string> {
  private logLevelNumber: number;
  constructor(
    private consumer: LogConsumer<T>,
    private logLevel: LogLevel = 'info',
    private logNamespace: string = ''
  ){
    this.logLevelNumber = logLevelNumbers[this.logLevel]
  }
  public debug = (payload: T) => this.send(0, 'debug', payload)
  public info = (payload: T) => this.send(1, 'info', payload)
  public warn = (payload: T) => this.send(2, 'warn', payload)
  public error = (payload: T) => this.send(3, 'error', payload)
  public namespace(logNamespace: string): Logger<T> {
    return new Logger(this.consumer, this.logLevel, this.logNamespace ? `${this.logNamespace}.${logNamespace}` : logNamespace);
  }
  public async asyncTask(taskName: string, fn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    this.send(0, 'debug', `${taskName}: start` as unknown as T);
    try {
      await fn();
      this.send(1, 'info', `${taskName}: success; completed in ${formatIntervalMs(Date.now() - start)}` as unknown as T)
    }catch(e){
      this.send(3, 'error', `${taskName}: error; failder after ${formatIntervalMs(Date.now() - start)}` as unknown as T)
      throw e;
    }
  }
  private send(logLevelNumber: number, logLevel: LogLevel, payload: T): void {
    if (logLevelNumber < this.logLevelNumber) {
      return;
    }
    const timestamp = Date.now();
    const namespace = this.logNamespace;
    const message: LogMessage<T> = {namespace, timestamp, logLevel, payload}
    this.consumer(message);
  }

}
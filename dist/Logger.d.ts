import { LogConsumer, LogLevel } from './interfaces';
export interface LoggerOptions<T = Error | string> {
    consumer: LogConsumer<T>;
    logLevel: LogLevel;
    logNamespace: string;
}
export declare class Logger<T = string | Error> {
    private consumer;
    private logLevel;
    private logNamespace;
    private logLevelNumber;
    constructor(options?: Partial<LoggerOptions<T>>);
    debug: (payload: T) => void;
    info: (payload: T) => void;
    warn: (payload: T) => void;
    error: (payload: T) => void;
    namespace(logNamespace: string): Logger<T>;
    private send;
}
//# sourceMappingURL=Logger.d.ts.map
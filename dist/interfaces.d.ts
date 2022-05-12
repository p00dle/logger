export declare type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
export interface LogMessage<T = string> {
    namespace: string;
    timestamp: number;
    logLevel: Exclude<LogLevel, 'silent'>;
    payload: T;
}
export declare type LogConsumer<T = string> = (msg: LogMessage<T>) => any;
//# sourceMappingURL=interfaces.d.ts.map
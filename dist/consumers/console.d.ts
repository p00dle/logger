import { LogConsumer } from '../interfaces';
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
export declare function consoleLogConsumerFactory(options?: Partial<ConsoleLogConsumerOptions>): LogConsumer<string | Error>;
//# sourceMappingURL=console.d.ts.map
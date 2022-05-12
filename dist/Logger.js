"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const console_1 = require("./consumers/console");
const logLevelNumbers = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
};
const defaultLoggerOptions = {
    consumer: (0, console_1.consoleLogConsumerFactory)(),
    logLevel: 'info',
    logNamespace: '',
};
class Logger {
    constructor(options) {
        this.debug = (payload) => this.send(0, 'debug', payload);
        this.info = (payload) => this.send(1, 'info', payload);
        this.warn = (payload) => this.send(2, 'warn', payload);
        this.error = (payload) => this.send(3, 'error', payload);
        const { consumer, logLevel, logNamespace } = options
            ? Object.assign(Object.assign({}, defaultLoggerOptions), options) : defaultLoggerOptions;
        this.consumer = consumer;
        this.logLevel = logLevel;
        this.logNamespace = logNamespace;
        this.logLevelNumber = logLevelNumbers[logLevel];
    }
    namespace(logNamespace) {
        return new Logger({
            consumer: this.consumer,
            logLevel: this.logLevel,
            logNamespace: this.logNamespace ? `${this.logNamespace}.${logNamespace}` : logNamespace,
        });
    }
    send(logLevelNumber, logLevel, payload) {
        if (logLevelNumber < this.logLevelNumber) {
            return;
        }
        const timestamp = Date.now();
        const namespace = this.logNamespace;
        const message = { namespace, timestamp, logLevel, payload };
        this.consumer(message);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map
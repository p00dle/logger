"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogConsumerFactory = void 0;
const get_timestamp_text_1 = require("../lib/get-timestamp-text");
const logColors = {
    debug: '\x1b[37m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    silent: '',
};
function stringifyPayload(payload) {
    return payload instanceof Error ? payload.stack : payload;
}
const defaultOptions = {
    useColors: true,
    useTimestamp: true,
    useLogLevel: true,
    useNamespace: true,
    useUTC: true,
    console,
};
function consoleLogConsumerFactory(options) {
    const { useColors, useTimestamp, useLogLevel, useNamespace, useUTC, console } = options
        ? Object.assign(Object.assign({}, defaultOptions), options) : defaultOptions;
    return ({ namespace, timestamp, logLevel, payload }) => {
        const text = [
            useColors ? logColors[logLevel] : '',
            useTimestamp ? (0, get_timestamp_text_1.getTimestampText)(timestamp, useUTC) : '',
            useLogLevel ? `[${logLevel.padEnd(5, ' ')}] ` : '',
            useNamespace && namespace.length > 0 ? `[${namespace}] ` : '',
            stringifyPayload(payload),
            useColors ? '\x1b[0m' : '',
        ].join('');
        console[logLevel](text);
    };
}
exports.consoleLogConsumerFactory = consoleLogConsumerFactory;
//# sourceMappingURL=console.js.map
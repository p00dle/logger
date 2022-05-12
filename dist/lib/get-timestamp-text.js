"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestampText = void 0;
function getTimestampText(n, useUTC) {
    const date = new Date(n);
    const [Y, M, D, h, m, s, ms, tz] = useUTC
        ? [
            String(date.getUTCFullYear()),
            String(date.getUTCMonth() + 1).padStart(2, '0'),
            String(date.getUTCDate()).padStart(2, '0'),
            String(date.getUTCHours()).padStart(2, '0'),
            String(date.getUTCMinutes()).padStart(2, '0'),
            String(date.getUTCSeconds()).padStart(2, '0'),
            String(date.getUTCMilliseconds()).padStart(3, '0'),
            'UTC',
        ]
        : [
            String(date.getFullYear()),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0'),
            String(date.getMilliseconds()).padStart(3, '0'),
            `UTC+${-(date.getTimezoneOffset() / 60)}`,
        ];
    return `${Y}-${M}-${D} ${h}:${m}:${s}.${ms} ${tz} `;
}
exports.getTimestampText = getTimestampText;
//# sourceMappingURL=get-timestamp-text.js.map
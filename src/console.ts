import colors = require('colors/safe');
import { LogConsumer } from './interfaces';

const logColors = {
  'debug': 'gray',
  'info': 'green',
  'warn': 'yellow',
  'error': 'red'
}

function getTimestampText(n : number): string{
  const date = new Date(n);
  return `${date.getUTCFullYear()}-${
    String(date.getUTCMonth() + 1).padStart(2, '0')}-${
    String(date.getUTCDate()).padStart(2, '0')} ${
    String(date.getHours()).padStart(2, '0')}:${
    String(date.getUTCMinutes()).padStart(2, '0')}:${
    String(date.getUTCSeconds()).padStart(2, '0')}.${
    String(date.getUTCMilliseconds()).padStart(3, '0')}`;
}

function stringId(str: string): string {
  return str;
}

function noOpString(str: string): void {

}

function stringifyPayload(payload: string | Error): string {
  return payload instanceof Error ? payload.stack || payload.message || String(payload) : payload;
}

export function consoleLoggerConsumerFactory(useColors: boolean = true, useTimestamp: boolean = true, useLogLevel: boolean = true): LogConsumer<string | Error> {
  if (useColors) {
    if (useTimestamp) {
      if (useLogLevel) {
        return ({namespace, timestamp, logLevel, payload}) => {
          const colorFn = (colors[logColors[logLevel]] || stringId) as (str: string) => string;
          const timestampText = colors.white(getTimestampText(timestamp));
          const logLevelText = colors.blue(`[${logLevel.padEnd(5, ' ')}]`);
          const namespaceText = colorFn(`[${namespace}]`);
          const payloadText = colorFn(stringifyPayload(payload));
          const text = `${timestampText} ${logLevelText} ${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      } else {
        return ({namespace, timestamp, logLevel, payload}) => {
          const colorFn = (colors[logColors[logLevel]] || stringId) as (str: string) => string;
          const timestampText = colors.white(getTimestampText(timestamp));
          const namespaceText = colorFn(`[${namespace}]`);
          const payloadText = colorFn(stringifyPayload(payload));
          const text = `${timestampText} ${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      }
    } else {
      if (useLogLevel) {
        return ({namespace, logLevel, payload}) => {
          const colorFn = (colors[logColors[logLevel]] || stringId) as (str: string) => string;
          const logLevelText = colors.blue(`[${logLevel.padEnd(5, ' ')}]`);
          const namespaceText = colorFn(`[${namespace}]`);
          const payloadText = colorFn(stringifyPayload(payload));
          const text = `${logLevelText} ${namespaceText} ${payloadText}`;    
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }    
      } else {
        return ({namespace, logLevel, payload}) => {
          const colorFn = (colors[logColors[logLevel]] || stringId) as (str: string) => string;
          const namespaceText = colorFn(`[${namespace}]`);
          const payloadText = colorFn(stringifyPayload(payload));
          const text = `${namespaceText} ${payloadText}`; 
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      }
    }
  } else {
    if (useTimestamp) {
      if (useLogLevel) {
        return ({namespace, timestamp, logLevel, payload}) => {
          const timestampText = getTimestampText(timestamp);
          const logLevelText = `[${logLevel.padEnd(5, ' ')}]`;
          const namespaceText = `[${namespace}]`;
          const payloadText = stringifyPayload(payload);
          const text = `${timestampText} ${logLevelText} ${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      } else {
        return ({namespace, timestamp, logLevel, payload}) => {
          const timestampText = getTimestampText(timestamp);
          const namespaceText = `[${namespace}]`;
          const payloadText = stringifyPayload(payload);
          const text = `${timestampText} ${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      }
    } else {
      if (useLogLevel) {
        return ({namespace, logLevel, payload}) => {
          const logLevelText = `[${logLevel.padEnd(5, ' ')}]`;
          const namespaceText = `[${namespace}]`;
          const payloadText = stringifyPayload(payload);
          const text = `${logLevelText} ${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      } else {
        return ({namespace, logLevel, payload}) => {
          const namespaceText = `[${namespace}]`;
          const payloadText = stringifyPayload(payload);
          const text = `${namespaceText} ${payloadText}`;
          const sendToConsole = (console[logLevel] || noOpString) as (str: string) => void;
          sendToConsole(text);
        }
      }
    }
  }
}
 
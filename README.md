### Overview

No dependency logging utility wrapper with customisable consumer

### Installation

```shell
yarn install @kksiuda/logger
```

or

```shell
npm install @kksiuda/logger
```

### API

#### Logger

Creates a [Logger](#logger) instance.

- input
  - consumer?: [LogConsumer](#logconsumer) (default: consoleLogConsumerFactory return value);
  - logLevel: [LogLevel](#loglevel) (default: 'info');
  - logNamespace: string; (default: '')
  - transformer: [Transformer](#transformer) (default: identity function)
- output
  - [Logger](#logger) instance

Example

```ts
import { Logger } from '@kksiuda/logger';

const log = new Logger();
log.debug('debug data');
log.info('some information');
log.warn('warning');
log.error(new Error('error message'));
// by default these logs will be output to console using consoleLogConsumerFactory default parameters
```

#### consoleLogConsumerFactory

- input
- params?:
  - useColors?: boolean; default: true; adds colors when logging to console:
    - debug: gray
    - info: green
    - warn: yellow
    - error: red
  - useTimestamp?: boolean; default: true; adds timestamp at the beginning of the log; see _useUTC_
  - useLogLevel?: boolean; default: true; adds _logLevel_ in square brackets padded to length 5
  - useNamespace?: boolean; default: true; adds _namespace_ in square brackets if it's not empty
  - useUTC?: boolean; default: true; formats timestamp using UTC when true, local time when false
  - console?: ConsoleLike; default: console; used for testing and debugging
- output
  - LogConsumer

Example

```ts
import { consoleLogConsumerFactory } from '@kksiuda/logger';
const logConsumer = consoleLogConsumerFactory({ useUTC: false, useNamespace: false });
logConsumer({ namespace: 'NS', timestamp: Date.now(), logLevel: 'info', payload: '' });
```

### Types

#### Logger

```ts
class Logger<T = string | Error, I extends any[] = [T]> {
  constructor(options?: {
    consumer?: LogConsumer<T>;
    logLevel?: LogLevel;
    logNamespace?: string;
    transformer?: Transformer<I, T>;
  })
  debug: (...payload: T) => void;
  info: (...payload: T) => void;
  warn: (...payload: T) => void;
  error: (...payload: T) => void;
  namespace: <I extends any[]>(logNamespace: string, transformer?: Transformer<I, T>): Logger<T, I>
```

- _logLevel_ defaults to 'info'; anything with _logLevel_ lower than the one provided will not call the consumer; when set to 'silent' it will do nothing
- _debug_, _info_, _warn_, _error_ call _consumer_ with [LogMessage](#logmessage)
- type T is inferred from the consumer; it can be anything, for example { message: string, additionalData?: string }
- namespace creates a new _Logger_ instance; the instance's namespace will be:
  - if parent namespace is empty -> child namespace
  - else "[parent namespace].[child namespace]"
  - it also allows to use a different logging format where a provided transformer outputs log payload in format accepted by parent

#### LogLevel

```ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
```

#### LogConsumer

```ts
type LogConsumer<T = string | Error> = (msg: LogMessage<T>) => any;
```

#### LogMessage

```ts
interface LogMessage<T = string | Error> {
  namespace: string;
  timestamp: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  payload: T;
}
```

#### Transformer

```ts
type Transformer<I extends any[], O> = (...args: I) => O;
```

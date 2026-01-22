import {
  createConsoleTransport,
  createNoopTransport,
  getDefaultLevel,
  getIsDev,
  LEVEL_VALUE,
  normalizeError,
} from './utils';

import type {
  Logger,
  LogLevel,
  LogMessage,
  LogMeta,
  LogTransport,
} from './types';

let currentLevel: LogLevel = getDefaultLevel();
let enabled = true;
let transport: LogTransport = getIsDev()
  ? createConsoleTransport()
  : createNoopTransport();

function isLevelEnabled(level: Exclude<LogLevel, 'silent'>) {
  if (!enabled) return false;
  if (currentLevel === 'silent') return false;
  return (
    LEVEL_VALUE[level] >=
    LEVEL_VALUE[currentLevel as Exclude<LogLevel, 'silent'>]
  );
}

function createLogger(scope?: string): Logger {
  return Object.freeze({
    setLevel(level: LogLevel) {
      currentLevel = level;
    },
    setTransport(nextTransport: LogTransport) {
      transport = nextTransport;
    },
    enable() {
      enabled = true;
    },
    disable() {
      enabled = false;
    },
    withScope(nextScope: string) {
      const combined = scope ? `${scope}:${nextScope}` : nextScope;
      return createLogger(combined);
    },
    debug(message: LogMessage, meta?: LogMeta) {
      if (!isLevelEnabled('debug')) return;
      transport.emit({
        timestamp: new Date().toISOString(),
        level: 'debug',
        scope,
        message,
        meta,
      });
    },
    info(message: LogMessage, meta?: LogMeta) {
      if (!isLevelEnabled('info')) return;
      transport.emit({
        timestamp: new Date().toISOString(),
        level: 'info',
        scope,
        message,
        meta,
      });
    },
    log(message: LogMessage, meta?: LogMeta) {
      if (!isLevelEnabled('info')) return;
      transport.emit({
        timestamp: new Date().toISOString(),
        level: 'info',
        scope,
        message,
        meta,
      });
    },
    warn(message: LogMessage, meta?: LogMeta) {
      if (!isLevelEnabled('warn')) return;
      transport.emit({
        timestamp: new Date().toISOString(),
        level: 'warn',
        scope,
        message,
        meta,
      });
    },
    error(message: LogMessage, meta?: LogMeta) {
      if (!isLevelEnabled('error')) return;
      transport.emit({
        timestamp: new Date().toISOString(),
        level: 'error',
        scope,
        message,
        meta,
        error: message instanceof Error ? normalizeError(message) : undefined,
      });
    },
  });
}

export const logger = createLogger();

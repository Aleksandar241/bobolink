import type {
  LogEvent,
  LogLevel,
  LogMessage,
  LogMeta,
  LogTransport,
  NormalizedError,
} from './types';

export const LEVEL_VALUE: Record<Exclude<LogLevel, 'silent'>, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function getIsDev() {
  return Boolean((globalThis as any).__DEV__);
}

export function getDefaultLevel(): LogLevel {
  return getIsDev() ? 'debug' : 'warn';
}

export function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '"[unserializable]"';
  }
}

export function normalizeError(err: unknown): NormalizedError {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  return { message: String(err) };
}

export function formatLine(
  level: string,
  scope: string | undefined,
  message: LogMessage,
  meta?: LogMeta
) {
  const ts = new Date().toISOString();
  const scopePart = scope ? ` [${scope}]` : '';
  const msgPart =
    message instanceof Error
      ? normalizeError(message).message
      : typeof message === 'string'
        ? message
        : safeStringify(message);
  const metaPart = meta ? ` ${safeStringify(meta)}` : '';
  return `${ts} ${level}${scopePart} ${msgPart}${metaPart}`;
}

export function createNoopTransport(): LogTransport {
  return Object.freeze({
    emit: () => {},
  });
}

export function createConsoleTransport(
  consoleLike: Pick<typeof console, 'log' | 'info' | 'warn' | 'error'> = console
): LogTransport {
  return Object.freeze({
    emit: (event: LogEvent) => {
      const line = formatLine(
        event.level.toUpperCase(),
        event.scope,
        event.message,
        event.meta
      );

      if (event.level === 'warn') {
        consoleLike.warn(line);
        return;
      }

      if (event.level === 'error') {
        if (event.error) {
          consoleLike.error(line, event.error);
          return;
        }
        consoleLike.error(line);
        return;
      }

      if (event.level === 'info') {
        consoleLike.log(line);
        return;
      }

      consoleLike.log(line);
    },
  });
}

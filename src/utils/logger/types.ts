export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export type LogMeta =
  | Record<string, unknown>
  | Readonly<Record<string, unknown>>
  | undefined;

export type LogMessage = unknown;

export type NormalizedError = {
  name?: string;
  message: string;
  stack?: string;
};

export type LogEvent = Readonly<{
  timestamp: string;
  level: Exclude<LogLevel, 'silent'>;
  scope?: string;
  message: LogMessage;
  meta?: LogMeta;
  error?: NormalizedError;
}>;

export type LogTransport = Readonly<{
  emit: (event: LogEvent) => void;
}>;

export type Logger = Readonly<{
  setLevel: (level: LogLevel) => void;
  setTransport: (transport: LogTransport) => void;
  enable: () => void;
  disable: () => void;
  withScope: (scope: string) => Logger;
  log: (message: LogMessage, meta?: LogMeta) => void;
  warn: (message: LogMessage, meta?: LogMeta) => void;
  error: (message: LogMessage, meta?: LogMeta) => void;
  debug: (message: LogMessage, meta?: LogMeta) => void;
  info: (message: LogMessage, meta?: LogMeta) => void;
}>;

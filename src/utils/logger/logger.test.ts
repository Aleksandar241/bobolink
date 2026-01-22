import { logger } from './logger';
import { createConsoleTransport } from './utils';

describe('utils/logger', () => {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    logger.setTransport(createConsoleTransport());
    logger.enable();
    logger.setLevel('debug');
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    logger.enable();
    logger.setLevel('silent');
  });

  it('logs info via logger.log', () => {
    logger.log('hello');
    expect(console.log).toHaveBeenCalled();
  });

  it('uses correct console methods for warn/error', () => {
    logger.warn('warn');
    logger.error('err');
    expect(console.warn).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('supports metadata', () => {
    logger.info('msg', { a: 1 });
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"a":1'));
  });

  it('supports namespacing via withScope', () => {
    const scoped = logger.withScope('Rest');
    scoped.info('x');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Rest]'));
  });

  it('can disable logging', () => {
    logger.disable();
    logger.info('nope');
    logger.warn('nope');
    logger.error('nope');
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('filters by level', () => {
    logger.setLevel('warn');
    logger.info('skip');
    logger.log('skip');
    logger.warn('take');
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('prints error details when given an Error', () => {
    const err = new Error('boom');
    logger.error(err);
    expect(console.error).toHaveBeenCalled();
  });
});

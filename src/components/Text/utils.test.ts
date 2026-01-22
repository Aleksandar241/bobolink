import { memoization } from './utils';

import type { TextProps } from './types';

describe('memoization', () => {
  it('should return false when style changes', () => {
    const prevProps: TextProps = { children: 'test', style: { fontSize: 16 } };
    const nextProps: TextProps = { children: 'test', style: { fontSize: 20 } };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return true when style is the same', () => {
    const style = { fontSize: 16 };
    const prevProps: TextProps = { children: 'test', style };
    const nextProps: TextProps = { children: 'test', style };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return true when both children are null', () => {
    const prevProps: TextProps = { children: null };
    const nextProps: TextProps = { children: null };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return false when one child is null and other is not', () => {
    const prevProps: TextProps = { children: null };
    const nextProps: TextProps = { children: 'test' };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return true when string children are the same', () => {
    const prevProps: TextProps = { children: 'test' };
    const nextProps: TextProps = { children: 'test' };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return false when string children are different', () => {
    const prevProps: TextProps = { children: 'test1' };
    const nextProps: TextProps = { children: 'test2' };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when children types are different', () => {
    const prevProps: TextProps = { children: 'test' };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return true when translation objects have same id', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return false when translation objects have different id', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.other' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return true when translation objects have same id and same params', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'John' } },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'John' } },
    };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return false when translation objects have same id but different params', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'John' } },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'Jane' } },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return true when translation objects have same id and both have no params', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(true);
  });

  it('should return false when one has params and other does not', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'John' } },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when params have different keys', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { name: 'John' } },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any, params: { age: 25 } },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when prevChildren is not an object after string check', () => {
    const prevProps: TextProps = { children: 123 as any };
    const nextProps: TextProps = { children: 456 as any };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when prevHasId is true but nextHasId is false', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { other: 'value' } as any,
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when prevHasId is false but nextHasId is true', () => {
    const prevProps: TextProps = {
      children: { other: 'value' } as any,
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });

  it('should return false when ids are different in translation objects', () => {
    const prevProps: TextProps = {
      children: { id: 'features.auth.button' as any },
    };
    const nextProps: TextProps = {
      children: { id: 'features.auth.other' as any },
    };
    expect(memoization(prevProps, nextProps)).toBe(false);
  });
});

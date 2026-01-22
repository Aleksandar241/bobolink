import React from 'react';

import { renderHook } from '@testing-library/react-native';

import type { TranslationKey } from '@/src/localization';

import { useViewModel } from './useViewModel';

jest.mock('@/src/localization', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (key === '__throw__') throw new Error('boom');
      return params ? `${key}_${JSON.stringify(params)}` : key;
    },
  }),
}));

describe('useViewModel', () => {
  it('should return string children as text', () => {
    const { result } = renderHook(() => useViewModel({ children: 'Hello' }));
    expect(result.current.text).toBe('Hello');
  });

  it('should translate string key', () => {
    const { result } = renderHook(() =>
      useViewModel({
        children: 'features.auth.button' as unknown as TranslationKey,
      })
    );
    expect(result.current.text).toBe('features.auth.button');
  });

  it('should translate object with id', () => {
    const { result } = renderHook(() =>
      useViewModel({
        children: { id: 'features.auth.button' as unknown as TranslationKey },
      })
    );
    expect(result.current.text).toBe('features.auth.button');
  });

  it('should translate object with id and params', () => {
    const { result } = renderHook(() =>
      useViewModel({
        children: {
          id: 'features.auth.button' as unknown as TranslationKey,
          params: { name: 'John' },
        },
      })
    );
    expect(result.current.text).toBe('features.auth.button_{"name":"John"}');
  });

  it('falls back to key when translation throws', () => {
    const { result } = renderHook(() =>
      useViewModel({ children: '__throw__' as unknown as TranslationKey })
    );
    expect(result.current.text).toBe('__throw__');
  });

  it('should return ReactNode as is', () => {
    const node = React.createElement('div', null, 'Test');
    const { result } = renderHook(() => useViewModel({ children: node }));
    expect(result.current.text).toBe(node);
  });

  it('should handle null children', () => {
    const { result } = renderHook(() => useViewModel({ children: null }));
    expect(result.current.text).toBe(null);
  });

  it('should handle empty string', () => {
    const { result } = renderHook(() => useViewModel({ children: '' }));
    expect(result.current.text).toBe('');
  });
});

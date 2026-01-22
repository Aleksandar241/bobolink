import { act, renderHook } from '@testing-library/react-native';

import { useStableCallback } from './useStableCallback';

describe('useStableCallback', () => {
  it('should return a stable function reference', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useStableCallback(callback));

    const firstResult = result.current;
    rerender({});
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });

  it('should call the latest callback even when callback changes', () => {
    const callback1 = jest.fn(() => 'callback1');
    const callback2 = jest.fn(() => 'callback2');

    const { result, rerender } = renderHook(
      (props: { callback: () => string }) => useStableCallback(props.callback),
      {
        initialProps: { callback: callback1 },
      }
    );

    const stableCallback = result.current as () => string;

    act(() => {
      const result1 = stableCallback();
      expect(result1).toBe('callback1');
      expect(callback1).toHaveBeenCalledTimes(1);
    });

    rerender({ callback: callback2 });

    act(() => {
      const result2 = stableCallback();
      expect(result2).toBe('callback2');
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  it('should pass arguments correctly', () => {
    const callback = jest.fn((a: number, b: string) => `${a}-${b}`);
    const { result } = renderHook(() => useStableCallback(callback));

    act(() => {
      const resultValue = result.current(1, 'test');
      expect(resultValue).toBe('1-test');
      expect(callback).toHaveBeenCalledWith(1, 'test');
    });
  });

  it('should return the correct return value', () => {
    const callback = jest.fn(() => 'return value');
    const { result } = renderHook(() => useStableCallback(callback));

    act(() => {
      const returnValue = result.current();
      expect(returnValue).toBe('return value');
    });
  });

  it('should handle callback with no arguments', () => {
    const callback = jest.fn(() => 'no args');
    const { result } = renderHook(() => useStableCallback(callback));

    act(() => {
      const returnValue = result.current();
      expect(returnValue).toBe('no args');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle multiple callback updates', () => {
    const callback1 = jest.fn(() => 1);
    const callback2 = jest.fn(() => 2);
    const callback3 = jest.fn(() => 3);

    const { result, rerender } = renderHook(
      (props: { callback: () => number }) => useStableCallback(props.callback),
      {
        initialProps: { callback: callback1 },
      }
    );

    const stableCallback = result.current as () => number;

    act(() => {
      expect(stableCallback()).toBe(1);
    });

    rerender({ callback: callback2 });
    act(() => {
      expect(stableCallback()).toBe(2);
    });

    rerender({ callback: callback3 });
    act(() => {
      expect(stableCallback()).toBe(3);
    });
  });

  it('should maintain same reference across multiple renders with same callback', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useStableCallback(callback));

    const references: any[] = [];
    references.push(result.current);

    rerender({});
    references.push(result.current);

    rerender({});
    references.push(result.current);

    references.forEach((ref) => {
      expect(ref).toBe(references[0]);
    });
  });
});

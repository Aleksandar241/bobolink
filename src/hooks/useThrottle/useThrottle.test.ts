import { act, renderHook } from '@testing-library/react-native';

import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a throttled function', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    expect(typeof result.current).toBe('function');
  });

  it('should call callback immediately on first call', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls within delay period', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(300);
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(200);
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should use default delay of 500ms', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback));

    act(() => {
      result.current();
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to callback', () => {
    const callback = jest.fn((a: number, b: string) => `${a}-${b}`);
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current(1, 'test');
    });

    expect(callback).toHaveBeenCalledWith(1, 'test');
  });

  it('should allow calls after delay period', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  it('should handle custom delay times', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    act(() => {
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  it('should maintain stable reference across renders', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(
      (props: { delay: number }) => useThrottle(callback, props.delay),
      {
        initialProps: { delay: 500 },
      }
    );

    const firstReference = result.current;

    rerender({ delay: 500 });
    const secondReference = result.current;

    expect(firstReference).toBe(secondReference);
  });

  it('should handle rapid successive calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current();
      }
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should work with callback that has no return value', () => {
    const callback = jest.fn<void, [number]>((x: number) => {});
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current(42);
    });

    expect(callback).toHaveBeenCalledWith(42);
  });
});

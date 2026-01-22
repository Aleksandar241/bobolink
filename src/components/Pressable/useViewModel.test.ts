import { renderHook } from '@testing-library/react-native';

import { useThrottledViewModel, useViewModel } from './useViewModel';

describe('useViewModel', () => {
  it('should return activeStyles function', () => {
    const { result } = renderHook(() =>
      useViewModel({ style: { padding: 10 } })
    );
    expect(typeof result.current.activeStyles).toBe('function');
  });

  it('should apply style and opacity when pressed', () => {
    const style = { padding: 10 };
    const { result } = renderHook(() => useViewModel({ style }));
    const activeStyles = result.current.activeStyles({ pressed: true });
    expect(activeStyles).toContainEqual(style);
    expect(activeStyles).toContainEqual({ opacity: 0.5 });
  });

  it('should apply style and full opacity when not pressed', () => {
    const style = { padding: 10 };
    const { result } = renderHook(() => useViewModel({ style }));
    const activeStyles = result.current.activeStyles({ pressed: false });
    expect(activeStyles).toContainEqual(style);
    expect(activeStyles).toContainEqual({ opacity: 1 });
  });

  it('should handle undefined style', () => {
    const { result } = renderHook(() => useViewModel({}));
    const activeStyles = result.current.activeStyles({ pressed: false });
    expect(activeStyles).toContainEqual({ opacity: 1 });
  });
});

describe('useThrottledViewModel', () => {
  it('should return activeStyles and pressHandler', () => {
    const onPress = jest.fn();
    const { result } = renderHook(() =>
      useThrottledViewModel({
        style: { padding: 10 },
        onPress,
        throttleTime: 500,
      })
    );
    expect(typeof result.current.activeStyles).toBe('function');
    expect(typeof result.current.pressHandler).toBe('function');
  });

  it('should throttle pressHandler calls', async () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { result } = renderHook(() =>
      useThrottledViewModel({
        style: {},
        onPress,
        throttleTime: 500,
      })
    );

    const pressHandler = result.current.pressHandler;
    const mockEvent = {} as any;

    pressHandler(mockEvent);
    pressHandler(mockEvent);
    pressHandler(mockEvent);

    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);

    pressHandler(mockEvent);
    expect(onPress).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should use default throttleTime of 500ms', async () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { result } = renderHook(() =>
      useThrottledViewModel({
        style: {},
        onPress,
      })
    );

    const pressHandler = result.current.pressHandler;
    const mockEvent = {} as any;

    pressHandler(mockEvent);
    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(400);
    pressHandler(mockEvent);
    expect(onPress).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    pressHandler(mockEvent);
    expect(onPress).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should apply activeStyles correctly', () => {
    const style = { padding: 10 };
    const { result } = renderHook(() =>
      useThrottledViewModel({
        style,
        onPress: jest.fn(),
        throttleTime: 500,
      })
    );
    const activeStyles = result.current.activeStyles({ pressed: true });
    expect(activeStyles).toContainEqual(style);
    expect(activeStyles).toContainEqual({ opacity: 0.5 });
  });
});

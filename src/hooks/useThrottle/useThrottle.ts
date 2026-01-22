import { useRef } from 'react';

import { useStableCallback } from '../useStableCallback';

export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500
): T => {
  const lastCalled = useRef(0);

  const stableCallback = useStableCallback(callback);

  return useStableCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCalled.current >= delay) {
      lastCalled.current = now;
      stableCallback(...args);
    }
  }) as T;
};

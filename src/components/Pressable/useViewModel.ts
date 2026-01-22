import { GestureResponderEvent } from 'react-native';

import { useThrottle } from '@/src/hooks/useThrottle';

import { ViewModelProps } from './types';

export function useViewModel({
  style,
}: Omit<ViewModelProps, 'throttleTime' | 'onPress'>) {
  const activeStyles = ({ pressed }: { pressed: boolean }) => [
    style,
    { opacity: pressed ? 0.5 : 1 },
  ];
  return { activeStyles };
}

export function useThrottledViewModel({
  throttleTime = 500,
  style,
  onPress,
}: ViewModelProps) {
  const pressHandler = useThrottle(
    (event: GestureResponderEvent) => onPress?.(event),
    throttleTime
  );
  const activeStyles = ({ pressed }: { pressed: boolean }) => [
    style,
    { opacity: pressed ? 0.5 : 1 },
  ];
  return { activeStyles, pressHandler };
}

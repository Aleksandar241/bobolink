import React from 'react';

import { Pressable as RNPressable } from 'react-native';

import { useThrottledViewModel, useViewModel } from './useViewModel';

import type { PressableProps } from './types';

const PressableBase = ({ onPress, style, ...rest }: PressableProps) => {
  const { activeStyles } = useViewModel({ style });
  return <RNPressable {...rest} style={activeStyles} onPress={onPress} />;
};

const PressableThrottled = ({
  throttleTime,
  onPress,
  style,
  ...rest
}: PressableProps) => {
  const { activeStyles, pressHandler } = useThrottledViewModel({
    style,
    onPress,
    throttleTime,
  });
  return <RNPressable {...rest} style={activeStyles} onPress={pressHandler} />;
};

export const Pressable: React.FC<PressableProps> = ({
  throttled = false,
  throttleTime = 500,
  ...rest
}) => {
  const shouldThrottle = throttled && throttleTime && throttleTime > 0;
  if (shouldThrottle) {
    return <PressableThrottled {...rest} throttleTime={throttleTime} />;
  }
  return <PressableBase {...rest} />;
};

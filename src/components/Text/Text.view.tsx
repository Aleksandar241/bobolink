import React, { memo } from 'react';

import { Text as RNText } from 'react-native';

import { styles } from './styles';
import { useViewModel } from './useViewModel';
import { memoization } from './utils';

import type { TextProps } from './types';

export const Text: React.FC<TextProps> = memo(({ children, style }) => {
  const { text } = useViewModel({ children });

  return <RNText style={[styles.text, style]}>{text}</RNText>;
}, memoization);

Text.displayName = 'Text';

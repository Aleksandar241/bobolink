import React from 'react';

import { View } from 'react-native';

import type { BoxProps } from './types';

export const Box: React.FC<BoxProps> = (props) => {
  return <View {...props} />;
};

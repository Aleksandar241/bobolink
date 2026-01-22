import React from 'react';

import { Colors } from '@/src/theme';

import type { PressableProps } from '../Pressable';

export type IconProps = Readonly<
  Pick<PressableProps, 'onPress'> & {
    testID?: string;
    width?: number;
    height?: number;
    color?: keyof Colors;
    Icon: React.ElementType;
  }
>;

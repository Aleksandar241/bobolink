import React, { memo } from 'react';

import { useStyle } from '@/src/theme';

import { Pressable } from '../Pressable';

import { IconProps } from './types';

export const Icon: React.FC<IconProps> = memo(
  ({ onPress, Icon, color = 'primary', ...props }) => {
    const {
      theme: { colors },
    } = useStyle();

    if (onPress) {
      return (
        <Pressable onPress={onPress} testID={props?.testID}>
          <Icon {...props} color={colors[color]} />
        </Pressable>
      );
    }

    return <Icon {...props} color={colors[color]} />;
  }
);

Icon.displayName = 'Icon';

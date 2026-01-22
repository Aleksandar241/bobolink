import React from 'react';

import { Group } from '@shopify/react-native-skia';

import { RestDot } from './RestDot.view';
import { RestGlyph } from './RestGlyph.view';
import { useViewModel } from './useViewModel';

import type { RestProps } from './types';

export const Rest: React.FC<RestProps> = ({ value, withDot }) => {
  const { color } = useViewModel({ value, withDot });

  return (
    <Group>
      <RestGlyph value={value} color={color} />
      {withDot && <RestDot value={value} color={color} />}
    </Group>
  );
};

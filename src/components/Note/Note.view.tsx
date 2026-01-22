import React from 'react';

import { Group } from '@shopify/react-native-skia';

import { Beam } from './Beam.view';
import { Dot } from './Dot.view';
import { Flag } from './Flag.view';
import { Head } from './Head.view';
import { Stem } from './Stem.view';
import { useNoteViewModel } from './useNoteViewModel';

import type { NoteProps } from './types';

export const Note: React.FC<NoteProps> = ({
  value,
  direction = 'down',
  withDot = false,
  withTriplet = false,
  withBeam = false,
  hideFlag = false,
  hideStem = false,
}) => {
  const { color, showStem, groupStyle, showFlag } = useNoteViewModel({
    value,
    direction,
    withDot,
    withTriplet,
    withBeam,
    hideFlag,
    hideStem,
  });

  return (
    <Group>
      {showStem && <Stem direction={direction} color={color} />}
      {!withBeam && showFlag && !hideFlag && (
        <Flag direction={direction} color={color} value={value} />
      )}
      {withBeam && <Beam direction={direction} color={color} value={value} />}
      <Group transform={groupStyle?.transform}>
        <Head value={value} color={color} />
        {withDot && <Dot color={color} />}
      </Group>
    </Group>
  );
};

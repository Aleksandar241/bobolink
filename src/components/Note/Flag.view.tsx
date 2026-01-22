import React from 'react';

import { Group, Path, Skia } from '@shopify/react-native-skia';

import { HEAD_HEIGHT, HEAD_WIDTH } from './Head.view';
import { STEAM_HEIGHT } from './Stem.view';
import { FlagProps } from './types';

export const FLAG_SPACING = HEAD_HEIGHT;

const path = Skia.Path.Make()
  .moveTo(0.425073, 18.5704)
  .lineTo(0, 18.5704)
  .lineTo(0, 11.9286)
  .lineTo(0.425073, 11.9286)
  .cubicTo(3.02864, 10.3877, 6.45579, 7.99669, 6.45579, 5.04775)
  .cubicTo(6.45579, 3.53343, 6.03072, 2.07224, 5.36654, 0.717325)
  .cubicTo(5.28684, 0.292253, 5.63221, 0, 5.97758, 0)
  .cubicTo(6.16355, 0, 6.37609, 0.0797163, 6.50892, 0.292253)
  .cubicTo(7.1731, 1.78001, 7.57161, 3.4006, 7.57161, 5.04775)
  .cubicTo(7.57161, 10.4674, 0.425073, 13.1507, 0.425073, 18.5704)
  .close();

const downMatrix = Skia.Matrix()
  .translate(HEAD_WIDTH, STEAM_HEIGHT / 2 + FLAG_SPACING / 2)
  .scale(1, -1);
const downMatrix16 = Skia.Matrix()
  .translate(HEAD_WIDTH, STEAM_HEIGHT - FLAG_SPACING / 2)
  .scale(1, -1);
const downPath = path.copy().transform(downMatrix);
const downPath16 = path.copy().transform(downMatrix16);

const upMatrix = Skia.Matrix().translate(1, STEAM_HEIGHT / 2);
const upMatrix16 = Skia.Matrix().translate(
  1,
  STEAM_HEIGHT - FLAG_SPACING * 2.4
);
const upPath = path.copy().transform(upMatrix);
const upPath16 = path.copy().transform(upMatrix16);

export const Flag: React.FC<FlagProps> = ({
  direction = 'up',
  value,
  color,
}) => {
  if (value === 16) {
    return (
      <Group>
        <Path path={direction === 'down' ? downPath : upPath} color={color} />
        <Path
          path={direction === 'down' ? downPath16 : upPath16}
          color={color}
        />
      </Group>
    );
  }

  return <Path path={direction === 'down' ? downPath : upPath} color={color} />;
};

import React from 'react';

import { Group, Path, Skia } from '@shopify/react-native-skia';

import { HEAD_WIDTH } from './Head.view';
import { STEAM_HEIGHT } from './Stem.view';
import { BeamProps } from './types';

export const BEAM_HEIGHT = 3;
export const BEAM_SECONDARY_HEIGHT = 2;
export const BEAM_SPACING = 4;
export const BEAM_WIDTH = 20 * 2;

const upStemEndX = 0;
const upStemEndY = 3;

const upBeam8Path = Skia.Path.Make();
upBeam8Path.addRect({
  x: upStemEndX,
  y: upStemEndY,
  width: BEAM_WIDTH,
  height: BEAM_HEIGHT,
});

const upBeam16FirstPath = Skia.Path.Make();
upBeam16FirstPath.addRect({
  x: upStemEndX,
  y: upStemEndY,
  width: BEAM_WIDTH,
  height: BEAM_HEIGHT,
});

const upBeam16SecondPath = Skia.Path.Make();
upBeam16SecondPath.addRect({
  x: upStemEndX,
  y: upStemEndY + BEAM_SPACING,
  width: BEAM_WIDTH,
  height: BEAM_SECONDARY_HEIGHT,
});

const downStemEndX = HEAD_WIDTH - BEAM_WIDTH / 2 + 4;
const downStemEndY = 3 + STEAM_HEIGHT;

const downBeam8Path = Skia.Path.Make();
downBeam8Path.addRect({
  x: downStemEndX,
  y: downStemEndY,
  width: BEAM_WIDTH,
  height: BEAM_HEIGHT,
});

const downBeam16FirstPath = Skia.Path.Make();
downBeam16FirstPath.addRect({
  x: downStemEndX,
  y: downStemEndY,
  width: BEAM_WIDTH,
  height: BEAM_HEIGHT,
});

const downBeam16SecondPath = Skia.Path.Make();
downBeam16SecondPath.addRect({
  x: downStemEndX,
  y: downStemEndY - BEAM_SPACING,
  width: BEAM_WIDTH,
  height: BEAM_SECONDARY_HEIGHT,
});

export const Beam: React.FC<BeamProps> = ({
  direction = 'up',
  value,
  color = 'black',
}) => {
  if (value === 16) {
    return (
      <Group>
        <Path
          path={direction === 'up' ? downBeam16FirstPath : upBeam16FirstPath}
          color={color}
        />
        <Path
          path={direction === 'up' ? downBeam16SecondPath : upBeam16SecondPath}
          color={color}
        />
      </Group>
    );
  }
  return (
    <Path
      path={direction === 'up' ? downBeam8Path : upBeam8Path}
      color={color}
    />
  );
};

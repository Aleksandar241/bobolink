import React from 'react';

import { Path, Skia } from '@shopify/react-native-skia';

import { HEAD_HEIGHT, HEAD_WIDTH } from './Head.view';
import { StemProps } from './types';

export const STEM_WIDTH = 2;
export const STEAM_HEIGHT = HEAD_HEIGHT * 3.5;
export const STEM_Y = 3;
export const UP_STEM_X = 0.75;
export const DOWN_STEM_X = HEAD_WIDTH - 3.25;

const baseStemPath = Skia.Path.Make();

const upStemPath = baseStemPath.copy();
upStemPath.addRect({
  x: UP_STEM_X,
  y: STEM_Y,
  width: STEM_WIDTH,
  height: STEAM_HEIGHT,
});

const downStemPath = baseStemPath.copy();
downStemPath.addRect({
  x: DOWN_STEM_X,
  y: STEM_Y,
  width: STEM_WIDTH,
  height: STEAM_HEIGHT,
});

export const Stem: React.FC<StemProps> = ({
  direction = 'up',
  color = 'black',
}) => {
  if (direction === 'down') {
    return <Path path={downStemPath} color={color} />;
  }

  return <Path path={upStemPath} color={color} />;
};

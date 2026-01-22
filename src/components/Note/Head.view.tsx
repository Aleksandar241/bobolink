import React from 'react';

import { Path, PathOp, Skia } from '@shopify/react-native-skia';

import { HeadProps } from './types';

export const HEAD_WIDTH = 15;
export const HEAD_HEIGHT = 10;

const HEAD_INSET = 0.75;

const basePath = Skia.Path.Make();
basePath.addOval({
  x: HEAD_INSET,
  y: HEAD_INSET,
  width: HEAD_WIDTH - HEAD_INSET * 2,
  height: HEAD_HEIGHT - HEAD_INSET * 2,
});

const x = HEAD_INSET + (HEAD_WIDTH - HEAD_INSET * 2) / 5 + 0.25;
const y = HEAD_INSET + (HEAD_HEIGHT - HEAD_INSET * 2) / 5;
const width = (HEAD_WIDTH - HEAD_INSET * 2) / 2 + 0.75;
const height = (HEAD_HEIGHT - HEAD_INSET * 2) / 2 + 0.75;
const cx = x + width / 2;
const cy = y + height / 2;

const rotation = Math.PI / 4;
const negativeRotation = -Math.PI / 4;

const matrix = Skia.Matrix()
  .translate(cx, cy)
  .rotate(rotation)
  .translate(-cx, -cy);
const negativeMatrix = Skia.Matrix()
  .translate(cx, cy)
  .rotate(negativeRotation)
  .translate(-cx, -cy);

const holeBasePath = Skia.Path.Make().addOval({ x, y, width, height });
const holePath = holeBasePath.copy().transform(matrix);
const negativeHolePath = holeBasePath.copy().transform(negativeMatrix);

const finalPath = Skia.Path.MakeFromOp(basePath, holePath, PathOp.Difference);
const negativeFinalPath = Skia.Path.MakeFromOp(
  basePath,
  negativeHolePath,
  PathOp.Difference
);

export const Head: React.FC<HeadProps> = ({ value, color }) => {
  if (value === 1) {
    return <Path path={finalPath!} color={color} />;
  }
  if (value === 2) {
    return <Path path={negativeFinalPath!} color={color} />;
  }

  return <Path path={basePath} color={color} />;
};

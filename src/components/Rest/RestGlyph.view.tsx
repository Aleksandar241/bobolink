import React from 'react';

import { Group, Path, Skia } from '@shopify/react-native-skia';

import { GlyphProps } from './types';
import { REST_HEIGHT, REST_WIDTH } from './useViewModel';
import { getRestSvgScaledPaths } from './utils';

import type { RestValue } from './types';

const GLYPH_PAD = 2;
const SMALL_GLYPH_TRANSLATE_Y = 6;
const SVG_TARGET_W = REST_WIDTH - GLYPH_PAD * 2;
const SVG_TARGET_H = REST_HEIGHT - GLYPH_PAD * 2;

const SVG_GLYPH_CACHE = new Map<
  RestValue,
  ReturnType<typeof getRestSvgScaledPaths>
>();

function getCachedSvgGlyph(value: RestValue) {
  if (SVG_GLYPH_CACHE.has(value)) return SVG_GLYPH_CACHE.get(value)!;

  const paths = getRestSvgScaledPaths(
    value,
    SVG_TARGET_W,
    SVG_TARGET_H,
    GLYPH_PAD
  );
  SVG_GLYPH_CACHE.set(value, paths);
  return paths;
}

const wholeRest = (() => {
  const p = Skia.Path.Make();
  p.addRect({ x: 3, y: 2, width: 12, height: 4 });
  return p;
})();

const halfRest = (() => {
  const p = Skia.Path.Make();
  p.addRect({ x: 3, y: 6, width: 12, height: 4 });
  return p;
})();

const quarterRest = Skia.Path.Make()
  .moveTo(10, 2)
  .lineTo(7, 10)
  .lineTo(12, 16)
  .lineTo(8, 26)
  .lineTo(12, 34)
  .cubicTo(13, 37, 10, 40, 7, 38)
  .cubicTo(5, 36, 6, 33, 8, 32)
  .close();

const eighthRest = Skia.Path.Make()
  .moveTo(10, 3)
  .lineTo(10, 26)
  .cubicTo(10, 32, 4, 34, 6, 39)
  .cubicTo(7, 42, 13, 41, 14, 36)
  .cubicTo(15, 32, 13, 29, 10, 28)
  .close()
  .moveTo(10, 6)
  .cubicTo(14, 8, 16, 12, 14, 16)
  .cubicTo(13, 18, 11, 19, 10, 18)
  .close();

const sixteenthRest = Skia.Path.Make();
sixteenthRest.addPath(eighthRest);
sixteenthRest
  .moveTo(10, 12)
  .cubicTo(14, 14, 16, 18, 14, 22)
  .cubicTo(13, 24, 11, 25, 10, 24)
  .close();

function glyphForValue(value: RestValue) {
  const svgPaths = getCachedSvgGlyph(value);
  if (svgPaths) return svgPaths;

  switch (value) {
    case 1:
      return wholeRest;
    case 2:
      return halfRest;
    case 4:
      return quarterRest;
    case 8:
      return eighthRest;
    case 16:
      return sixteenthRest;
  }
}

export const RestGlyph: React.FC<GlyphProps> = ({ value, color }) => {
  const path = glyphForValue(value);
  if (Array.isArray(path)) {
    return (
      <Group>
        {path.map((p, idx) => (
          <Path key={`${value}-${idx}`} path={p} color={color} />
        ))}
      </Group>
    );
  }
  if (value === 1 || value === 2) {
    return (
      <Group transform={[{ translateY: SMALL_GLYPH_TRANSLATE_Y }]}>
        <Path path={path} color={color} />
      </Group>
    );
  }
  return <Path path={path} color={color} />;
};

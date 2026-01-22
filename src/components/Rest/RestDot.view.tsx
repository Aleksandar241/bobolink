import React from 'react';

import { Path, Skia } from '@shopify/react-native-skia';

import { REST_HEIGHT, restWidthForValue } from './useViewModel';
import { getRestSvgScaledWidth } from './utils';

import type { RestValue } from './types';

const REST_DOT_RADIUS = 2.5;
const REST_DOT_SPACING = -2;

const DOT_PAD = 2;
const DOT_TARGET_HEIGHT = REST_HEIGHT - DOT_PAD * 2;

const GLYPH_SCALED_WIDTH_CACHE = new Map<RestValue, number | null>();

function getGlyphScaledWidth(value: RestValue): number | null {
  if (GLYPH_SCALED_WIDTH_CACHE.has(value)) {
    return GLYPH_SCALED_WIDTH_CACHE.get(value)!;
  }

  const w = getRestSvgScaledWidth(value, DOT_TARGET_HEIGHT);
  GLYPH_SCALED_WIDTH_CACHE.set(value, w);
  return w;
}

function getGlyphRightX(value: RestValue): number {
  const baseW = restWidthForValue(value, false);
  const glyphW = getGlyphScaledWidth(value);

  if (glyphW === null) return baseW;

  return DOT_PAD + (baseW - DOT_PAD * 2 - glyphW) / 2 + glyphW;
}

const DOT_PATH_CACHE = new Map<RestValue, ReturnType<typeof Skia.Path.Make>>();

function getDotPath(value: RestValue) {
  const cached = DOT_PATH_CACHE.get(value);
  if (cached) return cached;

  const path = Skia.Path.Make();
  const cx = getGlyphRightX(value) + REST_DOT_SPACING + REST_DOT_RADIUS;
  const cy = REST_HEIGHT / 2;

  path.addOval({
    x: cx - REST_DOT_RADIUS,
    y: cy - REST_DOT_RADIUS,
    width: REST_DOT_RADIUS * 2,
    height: REST_DOT_RADIUS * 2,
  });

  DOT_PATH_CACHE.set(value, path);
  return path;
}

export type RestDotProps = {
  color: string;
  value: RestValue;
};

export const RestDot: React.FC<RestDotProps> = ({ color, value }) => {
  return <Path path={getDotPath(value)} color={color} />;
};

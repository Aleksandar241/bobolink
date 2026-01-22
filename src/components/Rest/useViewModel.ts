import { useStyle } from '@/src/theme';

import type { RestValue } from './types';

export const REST_WIDTH = 24;
export const REST_HEIGHT = 59;
export const REST_SMALL_HEIGHT = 21;
export const REST_DOT_EXTRA_WIDTH = 6;
export const REST_WIDE_GLYPH_WIDTH = 32;

export function restWidthForValue(value: RestValue, withDot = false) {
  const base =
    value === 4 || value === 8 || value === 16
      ? REST_WIDE_GLYPH_WIDTH
      : REST_WIDTH;
  if (!withDot) return base;
  return base + REST_DOT_EXTRA_WIDTH;
}

export function restHeightForValue(value: RestValue) {
  if (value === 1 || value === 2) return REST_SMALL_HEIGHT;
  return REST_HEIGHT;
}

function getStyle(value: RestValue, withDot?: boolean) {
  return {
    width: restWidthForValue(value, Boolean(withDot)),
    height: restHeightForValue(value),
  };
}

export function useViewModel({
  value,
  withDot,
}: {
  value: RestValue;
  withDot?: boolean;
}) {
  const {
    theme: { colors },
  } = useStyle();

  return { color: colors.primary, style: getStyle(value, withDot) };
}

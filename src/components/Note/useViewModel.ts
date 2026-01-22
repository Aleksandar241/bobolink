import { useStyle } from '@/src/theme';

import { BEAM_WIDTH } from './Beam.view';
import { DOT_SPACING, DOT_WIDTH } from './Dot.view';
import { FLAG_SPACING } from './Flag.view';
import { HEAD_HEIGHT, HEAD_WIDTH } from './Head.view';
import { STEAM_HEIGHT, STEM_WIDTH } from './Stem.view';

import type { Layout, Transform, ViewModelProps } from './types';

const TRANSFORM_NONE: Transform = [];
const TRANSFORM_DOWN: Transform = [{ translateY: STEAM_HEIGHT }];

const LAYOUT_CACHE = new Map<string, Layout>();

function getLayout({
  value,
  withDot,
  withBeam,
  direction,
  hideFlag,
  hideStem,
}: ViewModelProps): Layout {
  const key = [
    value,
    withDot ? 1 : 0,
    withBeam ? 1 : 0,
    direction ?? '',
    hideFlag ? 1 : 0,
    hideStem ? 1 : 0,
  ].join('|');

  const cached = LAYOUT_CACHE.get(key);
  if (cached) return cached;

  const showStem = value !== 1 && !hideStem;
  const showFlag = value === 8 || value === 16;

  const withFlagWidth =
    showFlag && !withDot && direction === 'down' && !withBeam && !hideFlag
      ? FLAG_SPACING
      : 0;
  const withBeamWidth = withBeam ? BEAM_WIDTH / 2 : 0;
  const withStemWidth = showStem ? STEM_WIDTH : 0;
  const withStemHeight = showStem ? STEAM_HEIGHT : 0;
  const withDotWidth = withDot
    ? HEAD_WIDTH + DOT_WIDTH + DOT_SPACING
    : HEAD_WIDTH;

  const width = withStemWidth + withDotWidth + withFlagWidth + withBeamWidth;
  const height = HEAD_HEIGHT + withStemHeight;

  const style = Object.freeze({ width, height });
  const groupStyle = Object.freeze({
    transform:
      direction === 'down' && withStemHeight > 0
        ? TRANSFORM_DOWN
        : TRANSFORM_NONE,
  });

  const out: Layout = Object.freeze({ showStem, showFlag, style, groupStyle });
  LAYOUT_CACHE.set(key, out);
  return out;
}

export function useViewModel({
  value,
  withDot,
  withBeam,
  direction,
  hideFlag,
  hideStem,
}: ViewModelProps) {
  const {
    theme: { colors },
  } = useStyle();

  const { showStem, showFlag, style, groupStyle } = getLayout({
    value,
    withDot,
    withBeam,
    direction,
    hideFlag,
    hideStem,
  });

  return { color: colors.primary, showStem, style, groupStyle, showFlag };
}

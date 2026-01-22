import type { TimeSignature as TimeSignatureModel } from './types';

export const TIME_SIGNATURE_DEFAULT_DIGIT_WIDTH = 12;
export const TIME_SIGNATURE_DEFAULT_DIGIT_HEIGHT = 18;
export const TIME_SIGNATURE_DEFAULT_DIGIT_SPACING_X = 2;
export const TIME_SIGNATURE_DEFAULT_LINE_SPACING_Y = 4;

export const TIME_SIGNATURE_GAP_X = 8;

export function timeSignatureSize({
  timeSignature,
  digitWidth = TIME_SIGNATURE_DEFAULT_DIGIT_WIDTH,
  digitHeight = TIME_SIGNATURE_DEFAULT_DIGIT_HEIGHT,
  digitSpacingX = TIME_SIGNATURE_DEFAULT_DIGIT_SPACING_X,
  lineSpacingY = TIME_SIGNATURE_DEFAULT_LINE_SPACING_Y,
}: {
  timeSignature: TimeSignatureModel;
  digitWidth?: number;
  digitHeight?: number;
  digitSpacingX?: number;
  lineSpacingY?: number;
}) {
  const top = String(timeSignature.beats);
  const bottom = String(timeSignature.beatValue);

  const topW =
    top.length * digitWidth + Math.max(0, top.length - 1) * digitSpacingX;
  const bottomW =
    bottom.length * digitWidth + Math.max(0, bottom.length - 1) * digitSpacingX;

  const width = Math.max(topW, bottomW);
  const height = digitHeight * 2 + lineSpacingY;
  return { width, height };
}

export const KEY_SIGNATURE_ICON_SIZE = 16;

export const KEY_SIGNATURE_ICON_HEIGHT = 24;

export const KEY_SIGNATURE_SPACING_X = -7;
export const KEY_SIGNATURE_GAP_X = 8;

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export function clampAccidentalCount(count: number | undefined): number {
  if (typeof count !== 'number') return 0;
  return clampInt(count, 0, 7);
}

export function keySignatureWidth({
  sharps,
  flats,
  iconSize = KEY_SIGNATURE_ICON_SIZE,
  spacingX = KEY_SIGNATURE_SPACING_X,
}: {
  sharps?: number;
  flats?: number;
  iconSize?: number;
  spacingX?: number;
}): number {
  const sharpCount = clampAccidentalCount(sharps);
  const flatCount = clampAccidentalCount(flats);
  const total = sharpCount + flatCount;
  if (total <= 0) return 0;
  return total * iconSize + Math.max(0, total - 1) * spacingX;
}

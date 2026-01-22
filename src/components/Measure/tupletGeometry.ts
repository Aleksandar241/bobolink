import { Skia } from '@shopify/react-native-skia';

import { HEAD_WIDTH } from '../Note/Head.view';

import { addOrientedQuad, clampNumber } from './pathMath';

import type { MeasureEvent, TripletPath } from './types';

type SvgRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;
type BoundsProvider = Readonly<{ computeTightBounds?: () => SvgRect }>;

const TRIPLET_BRACKET_THICKNESS = 1.5;
const TRIPLET_BRACKET_HOOK = 6;
const TRIPLET_BRACKET_Y_OFFSET = 10;

const TRIPLET_NUMBER_W = 8;
const TRIPLET_NUMBER_H = 12;
const TRIPLET_NUMBER_GAP = 3;
const TRIPLET_NUMBER_NO_BRACKET_Y_SHIFT = 4;

const TUPLET_3_D =
  'M8 19.0004C8.83566 19.6281 9.87439 20 11 20C13.7614 20 16 17.7614 16 15C16 12.2386 13.7614 10 11 10L16 4H8';
const TUPLET_6_D =
  'M13 4L7.77313 12.3279M17 15C17 17.7614 14.7614 20 12 20C9.23858 20 7 17.7614 7 15C7 12.2386 9.23858 10 12 10C14.7614 10 17 12.2386 17 15Z';

const TUPLET_3_BASE = Skia.Path.MakeFromSVGString(TUPLET_3_D)!;
const TUPLET_6_BASE = Skia.Path.MakeFromSVGString(TUPLET_6_D)!;

function makeTupletNumberPath(
  label: '3' | '6',
  x: number,
  y: number,
  w: number,
  h: number
) {
  const base = label === '6' ? TUPLET_6_BASE : TUPLET_3_BASE;
  const b = (base as unknown as BoundsProvider).computeTightBounds!();

  const bw = Math.max(1e-6, b.width);
  const bh = Math.max(1e-6, b.height);
  const s = Math.min(w / bw, h / bh);

  const scaledW = bw * s;
  const scaledH = bh * s;
  const tx = x + (w - scaledW) / 2;
  const ty = y + (h - scaledH) / 2;

  const matrix = Skia.Matrix()
    .translate(tx, ty)
    .scale(s, s)
    .translate(-b.x, -b.y);
  return base.copy().transform(matrix);
}

export function computeTupletPaths({
  events,
  xOffsets,
  yOffsets,
}: {
  events: readonly MeasureEvent[];
  xOffsets: readonly number[];
  yOffsets: readonly number[];
}): TripletPath[] {
  const out: TripletPath[] = [];
  if (events.length === 0) return out;

  let i = 0;
  let gIndex = 0;
  while (i < events.length) {
    const e = events[i]!;
    if (e.kind !== 'note' || !e.withTriplet) {
      i += 1;
      continue;
    }

    const runValue = e.value;
    const runStart = i;
    while (i < events.length) {
      const ee = events[i]!;
      if (ee.kind !== 'note' || !ee.withTriplet) break;
      if (ee.value !== runValue) break;
      i += 1;
    }
    const runEnd = i - 1;

    const groupSize = runValue === 16 ? 6 : 3;
    const label = runValue === 16 ? '6' : '3';
    const showBracket = runValue === 2 || runValue === 4 || runValue === 16;

    for (let p = runStart; p + (groupSize - 1) <= runEnd; p += groupSize) {
      const first = p;
      const last = p + (groupSize - 1);

      const xFirst = xOffsets[first]! + HEAD_WIDTH / 2;
      const xLast = xOffsets[last]! + HEAD_WIDTH / 2;
      const xStart = Math.min(xFirst, xLast) - 2;
      const xEnd = Math.max(xFirst, xLast) + 2;
      const width = Math.max(0, xEnd - xStart);
      if (width <= 0) continue;

      const refXs: number[] = [];
      const refYs: number[] = [];
      for (let k = first; k <= last; k += 1) {
        refXs.push(xOffsets[k]! + HEAD_WIDTH / 2);
        refYs.push(yOffsets[k]!);
      }
      const dx = refXs[refXs.length - 1]! - refXs[0]!;
      let m = dx !== 0 ? (refYs[refYs.length - 1]! - refYs[0]!) / dx : 0;
      m = clampNumber(m, -0.35, 0.35);
      const candidates = refYs.map((yy, i2) => yy - m * refXs[i2]!);
      const b = Math.min(...candidates) - TRIPLET_BRACKET_Y_OFFSET;

      if (showBracket) {
        const bracket = Skia.Path.Make();
        const yStart = m * xStart + b;
        const yEnd = m * xEnd + b;

        const len = Math.hypot(xEnd - xStart, yEnd - yStart) || 1;
        const nx = -(yEnd - yStart) / len;
        const ny = (xEnd - xStart) / len;
        const tx = nx * TRIPLET_BRACKET_THICKNESS;
        const ty = ny * TRIPLET_BRACKET_THICKNESS;

        const xMid = (xStart + xEnd) / 2;
        const gapHalf = TRIPLET_NUMBER_W / 2 + TRIPLET_NUMBER_GAP + 1;
        const xGapLeft = Math.max(xStart, xMid - gapHalf);
        const xGapRight = Math.min(xEnd, xMid + gapHalf);
        const yGapLeft = m * xGapLeft + b;
        const yGapRight = m * xGapRight + b;

        addOrientedQuad(bracket, xStart, yStart, xGapLeft, yGapLeft, tx, ty);
        addOrientedQuad(bracket, xGapRight, yGapRight, xEnd, yEnd, tx, ty);

        const tanX = (xEnd - xStart) / len;
        const tanY = (yEnd - yStart) / len;
        const hx = nx * TRIPLET_BRACKET_HOOK;
        const hy = ny * TRIPLET_BRACKET_HOOK;
        const htx = tanX * TRIPLET_BRACKET_THICKNESS;
        const hty = tanY * TRIPLET_BRACKET_THICKNESS;
        addOrientedQuad(
          bracket,
          xStart,
          yStart,
          xStart + hx,
          yStart + hy,
          htx,
          hty
        );
        addOrientedQuad(bracket, xEnd, yEnd, xEnd + hx, yEnd + hy, htx, hty);
        out.push({
          path: bracket,
          key: `tuplet-bracket-${label}-${gIndex}-${p}`,
        });
      }

      const numX = (xStart + xEnd) / 2 - TRIPLET_NUMBER_W / 2;
      const yMid = m * ((xStart + xEnd) / 2) + b;
      const numY =
        yMid -
        TRIPLET_NUMBER_H -
        TRIPLET_NUMBER_GAP +
        (showBracket ? 0 : TRIPLET_NUMBER_NO_BRACKET_Y_SHIFT);
      const numPath = makeTupletNumberPath(
        label,
        numX,
        numY,
        TRIPLET_NUMBER_W,
        TRIPLET_NUMBER_H
      );
      out.push({ path: numPath, key: `tuplet-num-${label}-${gIndex}-${p}` });

      gIndex += 1;
    }
  }

  return out;
}

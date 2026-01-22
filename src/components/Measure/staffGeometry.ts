import { Skia } from '@shopify/react-native-skia';

import { HEAD_HEIGHT, HEAD_WIDTH } from '../Note/Head.view';
import { STEAM_HEIGHT } from '../Note/Stem.view';
import { restHeightForValue } from '../Rest/useViewModel';

import { getClefConfig } from './clefConfig';

import type { Clef, LedgerLinePath, MeasureEvent, StaffPath } from './types';

const STAFF_LINE_COUNT = 5;
const STAFF_LINE_SPACING = 8;
const STAFF_LINE_THICKNESS = 1;
const STAFF_STEP = STAFF_LINE_SPACING / 2;

const LETTER_TO_DIATONIC: Record<
  'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g',
  number
> = {
  c: 0,
  d: 1,
  e: 2,
  f: 3,
  g: 4,
  a: 5,
  b: 6,
};

function toDiatonicIndex(
  letter: keyof typeof LETTER_TO_DIATONIC,
  octave: number
): number {
  return octave * 7 + LETTER_TO_DIATONIC[letter];
}

export type StaffMetrics = Readonly<{
  staffTop: number;
  staffHeight: number;
  middleLineY: number;
  paddingY: number;
}>;

export function createStaffMetrics(): StaffMetrics {
  const staffHeight = (STAFF_LINE_COUNT - 1) * STAFF_LINE_SPACING;
  const paddingY = STEAM_HEIGHT + HEAD_HEIGHT;
  const staffTop = paddingY;
  const middleLineY =
    staffTop + (STAFF_LINE_COUNT - 1) * (STAFF_LINE_SPACING / 2);
  return { staffTop, staffHeight, middleLineY, paddingY };
}

export function computeEventYOffsets({
  events,
  clef,
  directionByIndex,
  middleLineY,
}: {
  events: readonly MeasureEvent[];
  clef: Clef;
  directionByIndex: readonly ('up' | 'down')[];
  middleLineY: number;
}): number[] {
  const staffRef = getClefConfig(clef).staffReference;
  const refD = toDiatonicIndex(staffRef.letter, staffRef.octave);

  return events.map((e, i) => {
    if (e.kind === 'rest') {
      const h = restHeightForValue(e.value);
      return middleLineY - h / 2;
    }

    const noteD = toDiatonicIndex(e.letter, e.octave);
    const stepDiff = noteD - refD;
    const headCenterY = middleLineY - stepDiff * STAFF_STEP;

    const dir = directionByIndex[i]!;
    const headCenterOffsetFromTop =
      (dir === 'down' ? STEAM_HEIGHT : 0) + HEAD_HEIGHT / 2;
    return headCenterY - headCenterOffsetFromTop;
  });
}

export function computeStaffPaths({
  measureWidth,
  staffTop,
}: {
  measureWidth: number;
  staffTop: number;
}): StaffPath[] {
  const paths: StaffPath[] = [];
  for (let i = 0; i < STAFF_LINE_COUNT; i += 1) {
    const y = staffTop + i * STAFF_LINE_SPACING - STAFF_LINE_THICKNESS / 2;
    const p = Skia.Path.Make();
    p.addRect({ x: 0, y, width: measureWidth, height: STAFF_LINE_THICKNESS });
    paths.push({ path: p, key: `staff-${i}` });
  }
  return paths;
}

export function computeLedgerLinePaths({
  events,
  clef,
  xOffsets,
  middleLineY,
}: {
  events: readonly MeasureEvent[];
  clef: Clef;
  xOffsets: readonly number[];
  middleLineY: number;
}): LedgerLinePath[] {
  const paths: LedgerLinePath[] = [];

  const topStep = -(STAFF_LINE_COUNT - 1);
  const bottomStep = STAFF_LINE_COUNT - 1;

  const staffRef = getClefConfig(clef).staffReference;
  const refD = toDiatonicIndex(staffRef.letter, staffRef.octave);
  const lineWidth = HEAD_WIDTH + 8;
  const lineHalf = lineWidth / 2;

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i]!;
    if (e.kind !== 'note') continue;

    const noteD = toDiatonicIndex(e.letter, e.octave);
    const stepDiff = noteD - refD;

    if (stepDiff > bottomStep) {
      const end = stepDiff % 2 === 0 ? stepDiff : stepDiff - 1;
      if (end <= bottomStep) continue;
      const start = bottomStep + 2;
      const cx = xOffsets[i]! + HEAD_WIDTH / 2;
      const x = cx - lineHalf;

      for (let s = start; s <= end; s += 2) {
        const yCenter = middleLineY - s * STAFF_STEP;
        const y = yCenter - STAFF_LINE_THICKNESS / 2;
        const p = Skia.Path.Make();
        p.addRect({ x, y, width: lineWidth, height: STAFF_LINE_THICKNESS });
        paths.push({ path: p, key: `ledger-${i}-${s}` });
      }
      continue;
    }

    if (stepDiff < topStep) {
      const end = stepDiff % 2 === 0 ? stepDiff : stepDiff + 1;
      if (end >= topStep) continue;
      const start = topStep - 2;
      const cx = xOffsets[i]! + HEAD_WIDTH / 2;
      const x = cx - lineHalf;

      for (let s = start; s >= end; s -= 2) {
        const yCenter = middleLineY - s * STAFF_STEP;
        const y = yCenter - STAFF_LINE_THICKNESS / 2;
        const p = Skia.Path.Make();
        p.addRect({ x, y, width: lineWidth, height: STAFF_LINE_THICKNESS });
        paths.push({ path: p, key: `ledger-${i}-${s}` });
      }
    }
  }

  return paths;
}

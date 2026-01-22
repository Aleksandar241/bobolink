import { DOT_SPACING, DOT_WIDTH } from '../Note/Dot.view';
import { FLAG_SPACING } from '../Note/Flag.view';
import { HEAD_HEIGHT, HEAD_WIDTH } from '../Note/Head.view';
import { STEAM_HEIGHT, STEM_WIDTH } from '../Note/Stem.view';
import { restWidthForValue } from '../Rest/useViewModel';

import { getMeasureBeamingGroups } from './beaming';
import { CLEF_GAP_X, clefIconSize } from './clefMetrics';
import { KEY_SIGNATURE_GAP_X, keySignatureWidth } from './keySignatureMetrics';
import {
  TIME_SIGNATURE_GAP_X,
  timeSignatureSize,
} from './timeSignatureMetrics';

import type {
  Clef,
  Layout,
  MeasureDirection,
  MeasureEvent,
  MeasureLayoutMeta,
  TimeSignature,
} from './types';

const STAFF_LINE_COUNT = 5;
const STAFF_LINE_SPACING = 8;

export const MEASURE_PADDING_X = 8;

function shouldShowStem(value: 1 | 2 | 4 | 8 | 16): boolean {
  return value !== 1;
}

function shouldShowFlag(value: 1 | 2 | 4 | 8 | 16): boolean {
  return value === 8 || value === 16;
}

function getStemWidth(value: 1 | 2 | 4 | 8 | 16): number {
  if (!shouldShowStem(value)) return 0;
  return STEM_WIDTH;
}

function getHeadAndDotWidth(withDot: boolean): number {
  if (!withDot) return HEAD_WIDTH;
  return HEAD_WIDTH + DOT_WIDTH + DOT_SPACING;
}

function getOptionalFlagSpacing({
  value,
  withDot,
  direction,
  hideFlag,
}: {
  value: 1 | 2 | 4 | 8 | 16;
  withDot: boolean;
  direction: 'up' | 'down';
  hideFlag: boolean;
}): number {
  if (!shouldShowFlag(value)) return 0;
  if (withDot) return 0;
  if (direction !== 'down') return 0;
  if (hideFlag) return 0;
  return FLAG_SPACING;
}

function noteWidth({
  value,
  withDot,
  direction,
  hideFlag,
}: {
  value: 1 | 2 | 4 | 8 | 16;
  withDot: boolean;
  direction: 'up' | 'down';
  hideFlag: boolean;
}): number {
  return (
    getStemWidth(value) +
    getHeadAndDotWidth(withDot) +
    getOptionalFlagSpacing({ value, withDot, direction, hideFlag })
  );
}

function beamedFlagsFromGroups(
  length: number,
  groups: readonly (readonly number[])[]
): boolean[] {
  const flags = Array(length).fill(false) as boolean[];
  for (const g of groups) for (const idx of g) flags[idx] = true;
  return flags;
}

function chooseDirectionFromMidi(
  midi: number,
  stemThresholdMidi: number
): 'up' | 'down' {
  return midi >= stemThresholdMidi ? 'up' : 'down';
}

function computeAverageMidiForGroup(
  events: readonly MeasureEvent[],
  group: readonly number[]
): number {
  let sum = 0;
  let count = 0;
  for (const idx of group) {
    const e = events[idx]!;
    if (e.kind !== 'note') continue;
    sum += e.midi;
    count += 1;
  }
  return sum / count;
}

function fillDirections(
  length: number,
  direction: 'up' | 'down'
): ('up' | 'down')[] {
  return Array(length).fill(direction) as ('up' | 'down')[];
}

function assignGroupDirections({
  events,
  groups,
  stemThresholdMidi,
  dirs,
}: {
  events: readonly MeasureEvent[];
  groups: readonly (readonly number[])[];
  stemThresholdMidi: number;
  dirs: ('up' | 'down')[];
}): void {
  for (const group of groups) {
    const avgMidi = computeAverageMidiForGroup(events, group);
    const d = chooseDirectionFromMidi(avgMidi, stemThresholdMidi);
    for (const idx of group) dirs[idx] = d;
  }
}

function assignUnbeamedNoteDirections({
  events,
  beamedFlags,
  stemThresholdMidi,
  dirs,
}: {
  events: readonly MeasureEvent[];
  beamedFlags: readonly boolean[];
  stemThresholdMidi: number;
  dirs: ('up' | 'down')[];
}): void {
  for (let i = 0; i < events.length; i += 1) {
    if (beamedFlags[i]) continue;
    const e = events[i]!;
    if (e.kind !== 'note') continue;
    dirs[i] = chooseDirectionFromMidi(e.midi, stemThresholdMidi);
  }
}

function computeDirectionByIndex({
  events,
  groups,
  direction,
  stemThresholdMidi,
  beamedFlags,
}: {
  events: readonly MeasureEvent[];
  groups: readonly (readonly number[])[];
  direction: MeasureDirection;
  stemThresholdMidi: number;
  beamedFlags: readonly boolean[];
}): ('up' | 'down')[] {
  if (direction !== 'auto') {
    return fillDirections(events.length, direction);
  }

  const dirs = fillDirections(events.length, 'down');
  assignGroupDirections({ events, groups, stemThresholdMidi, dirs });
  assignUnbeamedNoteDirections({
    events,
    beamedFlags,
    stemThresholdMidi,
    dirs,
  });

  return dirs;
}

function getStaffHeight(): number {
  return (STAFF_LINE_COUNT - 1) * STAFF_LINE_SPACING;
}

function getPaddingY(): number {
  return STEAM_HEIGHT + HEAD_HEIGHT;
}

function eventWidth({
  event,
  direction,
  hideFlag,
}: {
  event: MeasureEvent;
  direction: 'up' | 'down';
  hideFlag: boolean;
}): number {
  if (event.kind === 'rest') {
    return restWidthForValue(event.value, Boolean(event.withDot));
  }
  return noteWidth({
    value: event.value,
    withDot: Boolean(event.withDot),
    direction,
    hideFlag,
  });
}

function sumWidthsWithSpacing(
  widths: readonly number[],
  noteSpacing: number
): number {
  if (widths.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < widths.length; i += 1) {
    total += widths[i]!;
    if (i < widths.length - 1) total += noteSpacing;
  }
  return total;
}

function computeLeadingInset({
  timeSignature,
  showTimeSignature,
  showClef,
  clef,
  sharps,
  flats,
}: {
  timeSignature: TimeSignature;
  showTimeSignature: boolean;
  showClef: boolean;
  clef: Clef;
  sharps?: number;
  flats?: number;
}): number {
  if (!showClef && !showTimeSignature) return 0;

  const clefInset = showClef ? clefIconSize(clef) + CLEF_GAP_X : 0;
  const ksW = keySignatureWidth({ sharps, flats });
  const keySignatureInset = showClef && ksW > 0 ? ksW + KEY_SIGNATURE_GAP_X : 0;
  const timeSignatureInset = showTimeSignature
    ? timeSignatureSize({ timeSignature }).width + TIME_SIGNATURE_GAP_X
    : 0;
  return clefInset + keySignatureInset + timeSignatureInset;
}

function computeXOffsets(
  widths: readonly number[],
  noteSpacing: number
): number[] {
  if (widths.length === 0) return [];
  const xOffsets: number[] = [];
  let x = 0;
  for (let i = 0; i < widths.length; i += 1) {
    xOffsets.push(x);
    x += widths[i]! + (i < widths.length - 1 ? noteSpacing : 0);
  }
  return xOffsets;
}

export function computeMeasureLayout({
  events,
  timeSignature,
  noteSpacing = 8,
  direction = 'auto',
  stemThresholdMidi = 71,
  showTimeSignature = false,
  showClef = false,
  clef = 'treble',
  sharps,
  flats,
}: {
  events: readonly MeasureEvent[];
  timeSignature: TimeSignature;
  noteSpacing?: number;
  direction?: MeasureDirection;
  stemThresholdMidi?: number;
  showTimeSignature?: boolean;
  showClef?: boolean;
  clef?: Clef;
  sharps?: number;
  flats?: number;
}): Readonly<{
  layout: Layout;
  leadingInset: number;
  beamedFlags: boolean[];
  directionByIndex: ('up' | 'down')[];
  groups: number[][];
}> {
  const groups = getMeasureBeamingGroups(events, timeSignature);
  const beamedFlags = beamedFlagsFromGroups(events.length, groups);
  const directionByIndex = computeDirectionByIndex({
    events,
    groups,
    direction,
    stemThresholdMidi,
    beamedFlags,
  });

  const widths = events.map((e, i) =>
    eventWidth({
      event: e,
      direction: directionByIndex[i]!,
      hideFlag: beamedFlags[i] === true,
    })
  );

  const staffHeight = getStaffHeight();
  const paddingY = getPaddingY();
  const totalHeight = staffHeight + paddingY * 2;

  const totalWidth = sumWidthsWithSpacing(widths, noteSpacing);
  const xOffsets = computeXOffsets(widths, noteSpacing);
  const leadingInset = computeLeadingInset({
    timeSignature,
    showTimeSignature,
    showClef,
    clef,
    sharps,
    flats,
  });

  return {
    layout: { widths, xOffsets, totalWidth, totalHeight },
    leadingInset,
    beamedFlags,
    directionByIndex,
    groups,
  };
}

export function computeMeasureLayoutMeta({
  events,
  timeSignature,
  noteSpacing = 8,
  direction = 'auto',
  stemThresholdMidi = 71,
  showTimeSignature = false,
  showClef = false,
  clef = 'treble',
  sharps,
  flats,
}: {
  events: readonly MeasureEvent[];
  timeSignature: TimeSignature;
  noteSpacing?: number;
  direction?: MeasureDirection;
  stemThresholdMidi?: number;
  showTimeSignature?: boolean;
  showClef?: boolean;
  clef?: Clef;
  sharps?: number;
  flats?: number;
}): MeasureLayoutMeta {
  const { layout, leadingInset } = computeMeasureLayout({
    events,
    timeSignature,
    direction,
    stemThresholdMidi,
    noteSpacing,
    showTimeSignature,
    showClef,
    clef,
    sharps,
    flats,
  });

  return {
    totalWidth: layout.totalWidth + MEASURE_PADDING_X * 2 + leadingInset,
    totalHeight: layout.totalHeight,
  };
}

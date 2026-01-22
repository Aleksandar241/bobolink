import { DOT_SPACING, DOT_WIDTH } from '../Note/Dot.view';
import { createNote, createNoteDot } from '../Note/factory';
import { FLAG_SPACING } from '../Note/Flag.view';
import { HEAD_HEIGHT, HEAD_WIDTH } from '../Note/Head.view';
import { STEAM_HEIGHT, STEM_WIDTH } from '../Note/Stem.view';
import { createRest } from '../Rest/factory';
import { restWidthForValue } from '../Rest/useViewModel';

import { CLEF_GAP_X, clefIconSize } from './clefMetrics';
import { computeMeasureLayoutMeta, MEASURE_PADDING_X } from './layout';
import {
  TIME_SIGNATURE_GAP_X,
  timeSignatureSize,
} from './timeSignatureMetrics';

describe('components/Measure/layout', () => {
  const timeSignature = { beats: 4, beatValue: 4 } as const;

  it('computes totalHeight using staff + padding', () => {
    const meta = computeMeasureLayoutMeta({
      events: [createRest(4)],
      timeSignature,
    });

    const staffHeight = (5 - 1) * 8;
    const paddingY = STEAM_HEIGHT + HEAD_HEIGHT;
    expect(meta.totalHeight).toBe(staffHeight + paddingY * 2);
  });

  it('computes totalWidth for rests (includes measure padding)', () => {
    const meta = computeMeasureLayoutMeta({
      events: [createRest(4)],
      timeSignature,
    });

    expect(meta.totalWidth).toBe(
      restWidthForValue(4, false) + MEASURE_PADDING_X * 2
    );
  });

  it('includes leading inset when showing clef and time signature', () => {
    const meta = computeMeasureLayoutMeta({
      events: [createRest(4)],
      timeSignature,
      showTimeSignature: true,
      showClef: true,
    });

    const tsW = timeSignatureSize({ timeSignature }).width;
    const expectedInset =
      clefIconSize('treble') + CLEF_GAP_X + tsW + TIME_SIGNATURE_GAP_X;
    expect(meta.totalWidth).toBe(
      restWidthForValue(4, false) + MEASURE_PADDING_X * 2 + expectedInset
    );
  });

  it('includes flag spacing when an eighth note is not beamed (direction down, no dot)', () => {
    const events = [createNote('c3', 8), createRest(4)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'down',
    });

    const noteW = STEM_WIDTH + HEAD_WIDTH + FLAG_SPACING;
    const restW = restWidthForValue(4, false);
    const expected = noteW + 8 + restW + MEASURE_PADDING_X * 2;
    expect(meta.totalWidth).toBe(expected);
  });

  it('omits flag spacing for beamed eighth notes (two in a row within a beat)', () => {
    const events = [createNote('c3', 8), createNote('c3', 8)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'down',
    });

    const noteW = STEM_WIDTH + HEAD_WIDTH;
    const expected = noteW + 8 + noteW + MEASURE_PADDING_X * 2;
    expect(meta.totalWidth).toBe(expected);
  });

  it('accounts for dot width on notes', () => {
    const events = [createNoteDot('c3', 4)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'down',
    });

    const noteW = STEM_WIDTH + (HEAD_WIDTH + DOT_WIDTH + DOT_SPACING);
    expect(meta.totalWidth).toBe(noteW + MEASURE_PADDING_X * 2);
  });

  it('supports auto direction selection (covers group average midi path)', () => {
    const events = [createNote('c6', 8), createNote('c6', 8)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'auto',
    });
    expect(meta.totalWidth).toBeGreaterThan(0);
    expect(meta.totalHeight).toBeGreaterThan(0);
  });

  it('in auto mode, chooses direction by midi for unbeamed notes', () => {
    const metaLow = computeMeasureLayoutMeta({
      events: [createNote('c2', 4)],
      timeSignature,
      direction: 'auto',
    });
    const metaHigh = computeMeasureLayoutMeta({
      events: [createNote('c6', 4)],
      timeSignature,
      direction: 'auto',
    });
    expect(metaLow.totalWidth).toBeGreaterThan(0);
    expect(metaHigh.totalWidth).toBeGreaterThan(0);
  });

  it('omits flag spacing when direction is up', () => {
    const events = [createNote('c3', 8), createRest(4)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'up',
    });

    const noteW = STEM_WIDTH + HEAD_WIDTH;
    const restW = restWidthForValue(4, false);
    const expected = noteW + 8 + restW + MEASURE_PADDING_X * 2;
    expect(meta.totalWidth).toBe(expected);
  });

  it('omits flag spacing when the note is dotted', () => {
    const events = [createNoteDot('c3', 8), createRest(4)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'down',
    });

    const noteW = STEM_WIDTH + (HEAD_WIDTH + DOT_WIDTH + DOT_SPACING);
    const restW = restWidthForValue(4, false);
    const expected = noteW + 8 + restW + MEASURE_PADDING_X * 2;
    expect(meta.totalWidth).toBe(expected);
  });

  it('computes totalWidth for empty events (padding only)', () => {
    const events: never[] = [];
    const meta = computeMeasureLayoutMeta({ events, timeSignature });
    expect(meta.totalWidth).toBe(MEASURE_PADDING_X * 2);
  });

  it('does not include stem width for whole notes', () => {
    const events = [createNote('c3', 1)];
    const meta = computeMeasureLayoutMeta({
      events,
      timeSignature,
      direction: 'down',
    });
    expect(meta.totalWidth).toBe(HEAD_WIDTH + MEASURE_PADDING_X * 2);
  });
});

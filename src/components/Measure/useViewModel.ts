import React from 'react';

import { Skia } from '@shopify/react-native-skia';

import { useStyle } from '@/src/theme';
import { logger } from '@/src/utils/logger';

import {
  computeBeamLines,
  computeBeamPaths,
  computeStemPaths,
} from './beamGeometry';
import { MEASURE_PADDING_X, computeMeasureLayout } from './layout';
import {
  computeEventYOffsets,
  computeLedgerLinePaths,
  computeStaffPaths,
  createStaffMetrics,
} from './staffGeometry';
import { computeTupletPaths } from './tupletGeometry';

import type { BarlinePaths, ViewModelProps } from './types';

const BARLINE_THIN = 1;
const BARLINE_THICK = 3;

function getTimeSignatureTicks(beats: number, beatValue: number): number {
  return beats * (16 / beatValue);
}

export function useViewModel({
  events,
  timeSignature,
  clef = 'treble',
  sharps,
  flats,
  noteSpacing = 8,
  direction = 'auto',
  stemThresholdMidi = 71,
  isStart = false,
  isEnd = false,
  showTimeSignature = false,
  showClef = false,
}: ViewModelProps) {
  const {
    theme: { colors },
  } = useStyle();

  const staffMetrics = React.useMemo(() => createStaffMetrics(), []);

  const { layout, leadingInset, beamedFlags, directionByIndex, groups } =
    React.useMemo(
      () =>
        computeMeasureLayout({
          events,
          timeSignature,
          noteSpacing,
          direction,
          stemThresholdMidi,
          showTimeSignature,
          showClef,
          clef,
          sharps,
          flats,
        }),
      [
        clef,
        direction,
        events,
        flats,
        noteSpacing,
        sharps,
        showClef,
        showTimeSignature,
        stemThresholdMidi,
        timeSignature,
      ]
    );

  const measureWidth = React.useMemo(
    () => layout.totalWidth + MEASURE_PADDING_X * 2 + leadingInset,
    [layout.totalWidth, leadingInset]
  );

  const barlinePaths: BarlinePaths = React.useMemo(() => {
    const leftW = isStart ? BARLINE_THICK : BARLINE_THIN;
    const rightW = isEnd ? BARLINE_THICK : BARLINE_THIN;

    const left = Skia.Path.Make();
    left.addRect({
      x: 0,
      y: staffMetrics.staffTop,
      width: leftW,
      height: staffMetrics.staffHeight,
    });

    const right = Skia.Path.Make();
    const rightX = Math.max(0, measureWidth - rightW);
    right.addRect({
      x: rightX,
      y: staffMetrics.staffTop,
      width: rightW,
      height: staffMetrics.staffHeight,
    });

    return { left, right };
  }, [
    isEnd,
    isStart,
    measureWidth,
    staffMetrics.staffHeight,
    staffMetrics.staffTop,
  ]);

  const yOffsets = React.useMemo(
    () =>
      computeEventYOffsets({
        events,
        clef,
        directionByIndex,
        middleLineY: staffMetrics.middleLineY,
      }),
    [clef, directionByIndex, events, staffMetrics.middleLineY]
  );

  const beamLines = React.useMemo(
    () =>
      computeBeamLines({
        groups,
        xOffsets: layout.xOffsets,
        yOffsets,
        directionByIndex,
      }),
    [directionByIndex, groups, layout.xOffsets, yOffsets]
  );

  const beamPaths = React.useMemo(
    () =>
      computeBeamPaths({
        events,
        groups,
        beamLines,
        xOffsets: layout.xOffsets,
      }),
    [beamLines, events, groups, layout.xOffsets]
  );

  const stemPaths = React.useMemo(
    () =>
      computeStemPaths({
        events,
        groups,
        beamLines,
        xOffsets: layout.xOffsets,
        yOffsets,
      }),
    [beamLines, events, groups, layout.xOffsets, yOffsets]
  );

  const tripletPaths = React.useMemo(
    () =>
      computeTupletPaths({
        events,
        xOffsets: layout.xOffsets,
        yOffsets,
      }),
    [events, layout.xOffsets, yOffsets]
  );

  const staffPaths = React.useMemo(() => {
    if (layout.totalWidth <= 0) return [];
    return computeStaffPaths({ measureWidth, staffTop: staffMetrics.staffTop });
  }, [layout.totalWidth, measureWidth, staffMetrics.staffTop]);

  const ledgerLinePaths = React.useMemo(() => {
    if (layout.totalWidth <= 0) return [];
    return computeLedgerLinePaths({
      events,
      clef,
      xOffsets: layout.xOffsets,
      middleLineY: staffMetrics.middleLineY,
    });
  }, [
    clef,
    events,
    layout.totalWidth,
    layout.xOffsets,
    staffMetrics.middleLineY,
  ]);

  React.useEffect(() => {
    const measureTicks = getTimeSignatureTicks(
      timeSignature.beats,
      timeSignature.beatValue
    );
    const totalTicks = events.reduce((sum, e) => sum + e.ticks, 0);
    if (totalTicks <= measureTicks) return;

    logger.warn(
      `[Measure] events overflow the time signature (${totalTicks} ticks > ${measureTicks} ticks). ` +
        `Beaming will not connect across the barline. Consider splitting into multiple <Measure /> components.`
    );
  }, [events, timeSignature.beatValue, timeSignature.beats]);

  return {
    color: colors.primary,
    noteSpacing,
    layout,
    beamPaths,
    stemPaths,
    tripletPaths,
    barlinePaths,
    staffPaths,
    ledgerLinePaths,
    beamedFlags,
    directionByIndex,
    yOffsets,
    leadingInset,
  };
}

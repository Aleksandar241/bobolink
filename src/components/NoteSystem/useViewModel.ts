import React from 'react';

import { computeMeasureLayoutMeta } from '../Measure/layout';

import type { MeasureEvent, TimeSignature } from '../Measure/types';

export type NoteSystemViewModel = Readonly<{
  metas: readonly ReturnType<typeof computeMeasureLayoutMeta>[];
  width: number;
  height: number;
  xOffsets: readonly number[];
}>;

export function useViewModel({
  events,
  timeSignature,
  sharps,
  flats,
  clef,
}: {
  events: readonly (readonly MeasureEvent[])[];
  timeSignature: TimeSignature;
  sharps?: number;
  flats?: number;
  clef: 'treble' | 'bass';
}): NoteSystemViewModel {
  const metas = React.useMemo(
    () =>
      events.map((measureEvents, i) =>
        computeMeasureLayoutMeta({
          events: measureEvents,
          timeSignature,
          showTimeSignature: i === 0,
          showClef: i === 0,
          clef,
          sharps: i === 0 ? (sharps ?? 0) : 0,
          flats: i === 0 ? (flats ?? 0) : 0,
        })
      ),
    [clef, events, flats, sharps, timeSignature]
  );

  const { width, height, xOffsets } = React.useMemo(() => {
    let x = 0;
    const xOffsets = metas.map((m) => {
      const out = x;
      x += m.totalWidth;
      return out;
    });

    const width = x;
    const height = metas.reduce((max, m) => Math.max(max, m.totalHeight), 0);

    return { width, height, xOffsets };
  }, [metas]);

  return { metas, width, height, xOffsets };
}

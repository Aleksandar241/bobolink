import {
  getMeasureBeamedFlags,
  getMeasureBeamingGroups,
} from '@/src/components/Measure/beaming';
import { createNote, createNoteDot } from '@/src/components/Note/factory';
import { createRest } from '@/src/components/Rest/factory';

describe('components/Measure/beaming', () => {
  const ts44 = { beats: 4, beatValue: 4 } as const;

  it('eighth + quarter + eighth are NOT beamed', () => {
    const events = [
      createNote('c3', 8),
      createNote('c3', 4),
      createNote('c3', 8),
    ];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([]);
    expect(getMeasureBeamedFlags(events, ts44)).toEqual([false, false, false]);
  });

  it('eighth + eighth ARE beamed', () => {
    const events = [createNote('c3', 8), createNote('c3', 8)];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([[0, 1]]);
  });

  it('rests break groups', () => {
    const events = [createNote('c3', 8), createRest(8), createNote('c3', 8)];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([]);
  });

  it('does not beam across measure boundaries', () => {
    const events = [
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
      createNote('c3', 8),
    ];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
    ]);
  });

  it('returns empty groups/flags for empty events', () => {
    const events: never[] = [];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([]);
    expect(getMeasureBeamedFlags(events, ts44)).toEqual([]);
  });

  it('does not beam across a beat boundary when a note crosses it', () => {
    const events = [createNoteDot('c3', 8), createNote('c3', 8)];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([]);
  });

  it('throws on invalid time signatures', () => {
    const events = [createNote('c3', 8), createNote('c3', 8)];

    const badBeats = { beats: 0, beatValue: 4 } as unknown as Parameters<
      typeof getMeasureBeamingGroups
    >[1];
    expect(() => getMeasureBeamingGroups(events, badBeats)).toThrow();

    const badBeatValue = { beats: 4, beatValue: 0 } as unknown as Parameters<
      typeof getMeasureBeamingGroups
    >[1];
    expect(() => getMeasureBeamingGroups(events, badBeatValue)).toThrow();
  });

  it('resets grouping when events overflow the time signature', () => {
    const events = [
      createNoteDot('c3', 2), // 12 ticks
      createNote('c3', 2), // 8 ticks -> overflow (20 > 16)
      createNote('c3', 8),
      createNote('c3', 8),
    ];
    expect(getMeasureBeamingGroups(events, ts44)).toEqual([[2, 3]]);
  });
});

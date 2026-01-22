import { renderHook } from '@testing-library/react-native';

import { createNote, createNoteTriplet } from '../Note/factory';
import { FLAG_SPACING } from '../Note/Flag.view';
import { createRest } from '../Rest/factory';

import { useViewModel } from './useViewModel';

jest.mock('@/src/utils/logger', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

describe('components/Measure/useViewModel', () => {
  const timeSignature = { beats: 4, beatValue: 4 } as const;

  it('supports forced stem direction', () => {
    const events = [createNote('c5', 8), createNote('c5', 8)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature, direction: 'up' })
    );

    expect(result.current.directionByIndex).toEqual(['up', 'up']);
  });

  it('computes yOffsets for rests', () => {
    const events = [createRest(4)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.yOffsets).toHaveLength(1);
    expect(Number.isFinite(result.current.yOffsets[0]!)).toBe(true);
  });

  it('maps the same pitch to different Y positions for treble vs bass clef', () => {
    const events = [createNote('c4', 4)];

    const treble = renderHook(() =>
      useViewModel({ events, timeSignature, clef: 'treble' })
    ).result.current;
    const bass = renderHook(() =>
      useViewModel({ events, timeSignature, clef: 'bass' })
    ).result.current;

    expect(treble.yOffsets[0]).not.toBe(bass.yOffsets[0]);
  });

  it('builds beam paths for contiguous 16ths (secondary run beam)', () => {
    const events = [createNote('c5', 16), createNote('c5', 16)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.beamPaths.length).toBeGreaterThanOrEqual(2);
  });

  it('builds half-beams for isolated 16ths inside a beaming group', () => {
    const events = [
      createNote('c5', 16),
      createNote('c5', 8),
      createNote('c5', 16),
    ];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.beamPaths.length).toBeGreaterThanOrEqual(3);
  });

  it('builds stem paths for beamed groups', () => {
    const events = [createNote('c5', 8), createNote('c5', 8)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature, direction: 'down' })
    );

    expect(result.current.stemPaths.length).toBeGreaterThan(0);
  });

  it('creates ledger lines for notes far outside the staff', () => {
    const events = [createNote('c7', 4), createNote('c1', 4)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.ledgerLinePaths.length).toBeGreaterThan(0);
  });

  it('warns when events overflow the time signature', () => {
    const events = [
      createNote('c3', 4),
      createNote('c3', 4),
      createNote('c3', 4),
      createNote('c3', 4),
      createNote('c3', 4),
    ];

    const { logger } = jest.requireMock('@/src/utils/logger') as {
      logger: { warn: jest.Mock };
    };
    renderHook(() => useViewModel({ events, timeSignature }));

    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  it('builds start/end barlines without crashing', () => {
    const events = [createRest(4)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature, isStart: true, isEnd: true })
    );
    expect(result.current.barlinePaths.left).toBeTruthy();
    expect(result.current.barlinePaths.right).toBeTruthy();
  });

  it('returns empty staff/ledger paths when there is no horizontal space (no events)', () => {
    const events: never[] = [];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.layout.totalWidth).toBe(0);
    expect(result.current.staffPaths).toEqual([]);
    expect(result.current.ledgerLinePaths).toEqual([]);
  });

  it('chooses direction by midi for non-beamed notes in auto mode', () => {
    const events = [createNote('c2', 4), createNote('c6', 4)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.beamedFlags).toEqual([false, false]);
    expect(result.current.directionByIndex).toEqual(['down', 'up']);
  });

  it('does not create ledger lines for notes in the gap just outside the staff', () => {
    const events = [createNote('g5', 4), createNote('d4', 4)];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );

    expect(result.current.ledgerLinePaths).toEqual([]);
  });

  it('includes/excludes flag spacing in layout widths based on dot + beaming', () => {
    const a = renderHook(() =>
      useViewModel({
        events: [createNote('c5', 8), createRest(4)],
        timeSignature,
        direction: 'down',
      })
    ).result.current;
    expect(a.beamedFlags[0]).toBe(false);
    expect(a.layout.widths[0]!).toBeGreaterThan(0);

    const b = renderHook(() =>
      useViewModel({
        events: [createNote('c5', 8), createNote('c5', 8)],
        timeSignature,
        direction: 'down',
      })
    ).result.current;
    expect(b.beamedFlags).toEqual([true, true]);
    expect(b.layout.widths[0]!).toBeLessThan(a.layout.widths[0]!);
    expect(a.layout.widths[0]! - b.layout.widths[0]!).toBe(FLAG_SPACING);
  });

  it('creates tuplet number paths for 8th triplets (no bracket)', () => {
    const events = [
      createNoteTriplet('c5', 8),
      createNoteTriplet('c5', 8),
      createNoteTriplet('c5', 8),
    ];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );
    expect(
      result.current.tripletPaths.some((p) => p.key.startsWith('tuplet-num-3'))
    ).toBe(true);
    expect(
      result.current.tripletPaths.some((p) =>
        p.key.startsWith('tuplet-bracket-')
      )
    ).toBe(false);
  });

  it('creates tuplet bracket paths for quarter-note triplets', () => {
    const events = [
      createNoteTriplet('c5', 4),
      createNoteTriplet('c5', 4),
      createNoteTriplet('c5', 4),
    ];
    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature })
    );
    expect(
      result.current.tripletPaths.some((p) =>
        p.key.startsWith('tuplet-bracket-3')
      )
    ).toBe(true);
  });
});

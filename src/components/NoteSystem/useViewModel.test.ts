import { renderHook } from '@testing-library/react-native';

import { computeMeasureLayoutMeta } from '../Measure/layout';
import { createRest } from '../Rest/factory';

import { useViewModel } from './useViewModel';

jest.mock('../Measure/layout', () => ({
  computeMeasureLayoutMeta: jest.fn(),
}));

describe('components/NoteSystem/useViewModel', () => {
  it('returns metas, width, height and xOffsets derived from measure layout metadata', () => {
    const timeSignature = { beats: 4, beatValue: 4 } as const;
    const events = [[createRest(4)], [createRest(8), createRest(8)]];

    const computeMeasureLayoutMetaMock =
      computeMeasureLayoutMeta as jest.MockedFunction<
        typeof computeMeasureLayoutMeta
      >;

    const meta0 = { totalWidth: 111, totalHeight: 50 } as const;
    const meta1 = { totalWidth: 222, totalHeight: 100 } as const;
    computeMeasureLayoutMetaMock.mockReset();
    computeMeasureLayoutMetaMock.mockReturnValueOnce(meta0);
    computeMeasureLayoutMetaMock.mockReturnValueOnce(meta1);

    const { result } = renderHook(() =>
      useViewModel({ events, timeSignature, clef: 'treble' })
    );

    expect(result.current.metas).toEqual([meta0, meta1]);
    expect(result.current.width).toBe(meta0.totalWidth + meta1.totalWidth);
    expect(result.current.height).toBe(
      Math.max(meta0.totalHeight, meta1.totalHeight)
    );
    expect(result.current.xOffsets).toEqual([0, meta0.totalWidth]);

    expect(computeMeasureLayoutMetaMock).toHaveBeenCalledTimes(2);
    expect(computeMeasureLayoutMetaMock).toHaveBeenNthCalledWith(1, {
      events: events[0],
      timeSignature,
      showTimeSignature: true,
      showClef: true,
      clef: 'treble',
      sharps: 0,
      flats: 0,
    });
    expect(computeMeasureLayoutMetaMock).toHaveBeenNthCalledWith(2, {
      events: events[1],
      timeSignature,
      showTimeSignature: false,
      showClef: false,
      clef: 'treble',
      sharps: 0,
      flats: 0,
    });
  });

  it('memoizes metas/xOffsets when events and timeSignature references are stable', () => {
    const timeSignature = { beats: 4, beatValue: 4 } as const;
    const events = [[createRest(4)], [createRest(8), createRest(8)]];

    const computeMeasureLayoutMetaMock =
      computeMeasureLayoutMeta as jest.MockedFunction<
        typeof computeMeasureLayoutMeta
      >;

    const meta0 = { totalWidth: 10, totalHeight: 1 } as const;
    const meta1 = { totalWidth: 20, totalHeight: 2 } as const;
    computeMeasureLayoutMetaMock.mockReset();
    computeMeasureLayoutMetaMock.mockReturnValueOnce(meta0);
    computeMeasureLayoutMetaMock.mockReturnValueOnce(meta1);

    const { result, rerender } = renderHook(useViewModel, {
      initialProps: { events, timeSignature, clef: 'treble' },
    });

    const firstMetas = result.current.metas;
    const firstXOffsets = result.current.xOffsets;

    rerender({ events, timeSignature, clef: 'treble' });

    expect(result.current.metas).toBe(firstMetas);
    expect(result.current.xOffsets).toBe(firstXOffsets);
    expect(computeMeasureLayoutMetaMock).toHaveBeenCalledTimes(2);
  });
});

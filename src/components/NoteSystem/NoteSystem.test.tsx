import React from 'react';

import { View } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { computeMeasureLayoutMeta } from '../Measure/layout';
import { createRest } from '../Rest/factory';

import { NoteSystem } from './NoteSystem.view';
import { styles } from './styles';

jest.mock('../Measure/layout', () => ({
  computeMeasureLayoutMeta: jest.fn(),
}));

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('../Note/__testUtils__/skiaMock').createSkiaMock()
);

jest.mock('../Measure', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return { Measure: () => <View testID="measure" /> };
});

describe('components/NoteSystem/NoteSystem', () => {
  it('sizes the canvas based on measure layout metadata and offsets measures horizontally', () => {
    expect(styles.root).toBeTruthy();

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

    const expectedWidth = meta0.totalWidth + meta1.totalWidth;
    const expectedHeight = Math.max(meta0.totalHeight, meta1.totalHeight);

    render(
      <View>
        <NoteSystem
          events={events}
          timeSignature={timeSignature}
          clef="treble"
        />
      </View>
    );

    expect(screen.getByTestId('note-system-clef')).toBeTruthy();

    const canvas = screen.getByTestId('skia-canvas');
    expect(canvas.props.style).toEqual({
      width: expectedWidth,
      height: expectedHeight,
    });

    const groups = screen.getAllByTestId('skia-group');
    expect(groups).toHaveLength(2);
    expect(groups[0]!.props.transform).toEqual([{ translateX: 0 }]);
    expect(groups[1]!.props.transform).toEqual([
      { translateX: meta0.totalWidth },
    ]);

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

  it('renders sharps and flats key signatures after the clef (clamped to 0–7)', () => {
    const timeSignature = { beats: 4, beatValue: 4 } as const;
    const events = [[createRest(4)]];

    const computeMeasureLayoutMetaMock =
      computeMeasureLayoutMeta as jest.MockedFunction<
        typeof computeMeasureLayoutMeta
      >;
    computeMeasureLayoutMetaMock.mockReset();
    computeMeasureLayoutMetaMock.mockReturnValueOnce({
      totalWidth: 200,
      totalHeight: 100,
    });

    render(
      <View>
        <NoteSystem
          events={events}
          timeSignature={timeSignature}
          clef="treble"
          sharps={2}
          flats={9}
        />
      </View>
    );

    // sharps=2, flats=9 -> clamp flats to 7 => 9 total key signature paths
    expect(screen.getAllByTestId('skia-path')).toHaveLength(2 + 7);

    expect(computeMeasureLayoutMetaMock).toHaveBeenCalledWith({
      events: events[0],
      timeSignature,
      showTimeSignature: true,
      showClef: true,
      clef: 'treble',
      sharps: 2,
      flats: 7,
    });
  });
});

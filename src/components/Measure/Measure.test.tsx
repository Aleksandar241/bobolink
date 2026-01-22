import React from 'react';

import { View } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { createNote } from '../Note/factory';
import { createRest } from '../Rest/factory';

import { Measure } from './Measure.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('../Note/__testUtils__/skiaMock').createSkiaMock()
);

jest.mock('../Note/Note.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return { Note: () => <View testID="note" /> };
});

jest.mock('../Rest/Rest.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return { Rest: () => <View testID="rest" /> };
});

describe('components/Measure/Measure', () => {
  it('renders 5 staff lines', () => {
    const events = [createRest(4)];

    render(
      <View>
        <Measure
          events={events}
          timeSignature={{ beats: 4, beatValue: 4 }}
          showLeftBarline={false}
          showRightBarline={false}
        />
      </View>
    );

    expect(screen.getAllByTestId('skia-path')).toHaveLength(5);
  });

  it('renders stems/beams for beamed eighth notes (no barlines)', () => {
    const events = [createNote('c3', 8), createNote('c3', 8)];
    render(
      <View>
        <Measure
          events={events}
          timeSignature={{ beats: 4, beatValue: 4 }}
          showLeftBarline={false}
          showRightBarline={false}
        />
      </View>
    );

    expect(screen.getAllByTestId('skia-path').length).toBeGreaterThan(5);
  });

  it('renders triplet number as stroke path', () => {
    const events = [
      createNote('c3', 16, 3),
      createNote('c3', 16, 3),
      createNote('c3', 16, 3),
      createNote('c3', 16, 3),
      createNote('c3', 16, 3),
      createNote('c3', 16, 3),
    ];

    render(
      <View>
        <Measure
          events={events}
          timeSignature={{ beats: 4, beatValue: 4 }}
          showLeftBarline={false}
          showRightBarline={false}
        />
      </View>
    );

    const paths = screen.getAllByTestId('skia-path');
    expect(
      paths.some(
        (p) => p.props.style === 'stroke' && p.props.strokeWidth === 1.7
      )
    ).toBe(true);
  });

  it('renders a note and barlines without crashing', () => {
    const events = [createNote('c3', 4)];

    render(
      <View>
        <Measure events={events} timeSignature={{ beats: 4, beatValue: 4 }} />
      </View>
    );

    expect(screen.getAllByTestId('skia-path').length).toBeGreaterThan(5);
    expect(screen.getByTestId('note')).toBeTruthy();
  });
});

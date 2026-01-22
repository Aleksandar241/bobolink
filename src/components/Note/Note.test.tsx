import React from 'react';

import { View } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { Note } from './Note.view';

import type {
  BeamProps,
  DotProps,
  FlagProps,
  HeadProps,
  StemProps,
} from './types';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

jest.mock('./Stem.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    Stem: ({ direction, color }: StemProps) => (
      <View
        testID="note-stem"
        accessibilityLabel={`stem-${direction}-${color}`}
      />
    ),
  };
});

jest.mock('./Flag.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    Flag: ({ direction, value, color }: FlagProps) => (
      <View
        testID="note-flag"
        accessibilityLabel={`flag-${direction}-${value}-${color}`}
      />
    ),
  };
});

jest.mock('./Beam.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    Beam: ({ direction, value, color }: BeamProps) => (
      <View
        testID="note-beam"
        accessibilityLabel={`beam-${direction}-${value}-${color}`}
      />
    ),
  };
});

jest.mock('./Head.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    Head: ({ value, color }: HeadProps) => (
      <View testID="note-head" accessibilityLabel={`head-${value}-${color}`} />
    ),
  };
});

jest.mock('./Dot.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    Dot: ({ color }: DotProps) => (
      <View testID="note-dot" accessibilityLabel={`dot-${color}`} />
    ),
  };
});

describe('components/Note/Note', () => {
  it('renders head only for whole note (value=1)', () => {
    render(<Note value={1} />);
    expect(screen.getByTestId('note-head')).toBeTruthy();
    expect(screen.queryByTestId('note-stem')).toBeNull();
    expect(screen.queryByTestId('note-flag')).toBeNull();
    expect(screen.queryByTestId('note-beam')).toBeNull();
    expect(screen.queryByTestId('note-dot')).toBeNull();
  });

  it('renders stem and flag for 8th note when not beamed and not hidden', () => {
    render(<Note value={8} direction="down" />);
    expect(screen.getByTestId('note-stem')).toBeTruthy();
    expect(screen.getByTestId('note-flag')).toBeTruthy();
    expect(screen.queryByTestId('note-beam')).toBeNull();
  });

  it('renders beam instead of flag when withBeam is true', () => {
    render(<Note value={8} direction="down" withBeam />);
    expect(screen.getByTestId('note-stem')).toBeTruthy();
    expect(screen.getByTestId('note-beam')).toBeTruthy();
    expect(screen.queryByTestId('note-flag')).toBeNull();
  });

  it('does not render flag when hideFlag is true', () => {
    render(<Note value={8} direction="down" hideFlag />);
    expect(screen.getByTestId('note-stem')).toBeTruthy();
    expect(screen.queryByTestId('note-flag')).toBeNull();
  });

  it('renders dot when withDot is true', () => {
    render(<Note value={4} withDot />);
    expect(screen.getByTestId('note-dot')).toBeTruthy();
  });

  it('renders without crashing for all values', () => {
    const values = [1, 2, 4, 8, 16] as const;
    const { UNSAFE_root, rerender } = render(<View />);
    for (const value of values) {
      rerender(<Note value={value} withDot withBeam direction="down" />);
      expect(UNSAFE_root).toBeTruthy();
    }
  });
});

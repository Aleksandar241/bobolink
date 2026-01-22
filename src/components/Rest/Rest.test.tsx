import React from 'react';

import { View } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import { Rest } from './Rest.view';
import { restHeightForValue, restWidthForValue } from './useViewModel';

import type { GlyphProps, RestValue } from './types';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('../Note/__testUtils__/skiaMock').createSkiaMock()
);

jest.mock('./RestGlyph.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    RestGlyph: ({ value, color }: GlyphProps) => (
      <View
        testID="rest-glyph"
        accessibilityLabel={`glyph-${value}-${color}`}
      />
    ),
  };
});

jest.mock('./RestDot.view', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual(
    'react-native'
  ) as typeof import('react-native');
  return {
    RestDot: ({ value, color }: { value: RestValue; color: string }) => (
      <View testID="rest-dot" accessibilityLabel={`dot-${value}-${color}`} />
    ),
  };
});

describe('components/Rest/Rest', () => {
  it('renders glyph and no dot by default', () => {
    render(<Rest value={8} />);
    expect(screen.getByTestId('rest-glyph')).toBeTruthy();
    expect(screen.queryByTestId('rest-dot')).toBeNull();
  });

  it('renders dot when withDot is true', () => {
    render(<Rest value={8} withDot />);
    expect(screen.getByTestId('rest-glyph')).toBeTruthy();
    expect(screen.getByTestId('rest-dot')).toBeTruthy();
  });

  it('applies correct canvas size style', () => {
    const value = 4;
    expect(restWidthForValue(value, true)).toBeGreaterThan(0);
    expect(restHeightForValue(value)).toBeGreaterThan(0);
  });

  it('passes value + color into subcomponents', () => {
    render(<Rest value={16} withDot />);

    expect(screen.getByLabelText(/glyph-16-/)).toBeTruthy();
    expect(screen.getByLabelText(/dot-16-/)).toBeTruthy();
  });

  it('renders without crashing for all values', () => {
    const values = [1, 2, 4, 8, 16] as const;
    const { UNSAFE_root, rerender } = render(<View />);
    for (const value of values) {
      rerender(<Rest value={value} withDot />);
      expect(UNSAFE_root).toBeTruthy();
    }
  });
});

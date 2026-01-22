import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Stem } from './Stem.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

describe('components/Note/Stem', () => {
  it('renders a Path', () => {
    render(<Stem direction="down" color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('supports direction="up"', () => {
    render(<Stem direction="up" color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('supports default direction (up)', () => {
    render(<Stem />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });
});

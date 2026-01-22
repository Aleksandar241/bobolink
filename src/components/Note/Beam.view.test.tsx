import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Beam } from './Beam.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

describe('components/Note/Beam', () => {
  it('renders a single Path for 8th note beam', () => {
    render(<Beam direction="down" value={8} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('renders two Paths for 16th note beam', () => {
    render(<Beam direction="down" value={16} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(2);
  });

  it('supports direction="up" for 8th beams', () => {
    render(<Beam direction="up" value={8} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('supports direction="up" for 16th beams', () => {
    render(<Beam direction="up" value={16} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(2);
  });

  it('supports default props (direction/color defaults)', () => {
    render(<Beam value={8} />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });
});

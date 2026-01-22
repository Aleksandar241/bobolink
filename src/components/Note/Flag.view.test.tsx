import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Flag } from './Flag.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

describe('components/Note/Flag', () => {
  it('renders a single Path for 8th note flag', () => {
    render(<Flag direction="down" value={8} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('renders two Paths for 16th note flag', () => {
    render(<Flag direction="down" value={16} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(2);
  });

  it('supports direction="up" for 8th flags', () => {
    render(<Flag direction="up" value={8} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('supports direction="up" for 16th flags', () => {
    render(<Flag direction="up" value={16} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(2);
  });

  it('supports default direction (up)', () => {
    render(<Flag value={8} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });
});

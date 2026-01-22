import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Head } from './Head.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

describe('components/Note/Head', () => {
  it('renders a Path', () => {
    render(<Head value={4} color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });

  it('uses different paths for whole vs quarter (branch coverage)', () => {
    const whole = render(<Head value={1} color="red" />).getByTestId(
      'skia-path'
    );
    const quarter = render(<Head value={4} color="red" />).getByTestId(
      'skia-path'
    );
    expect(whole.props.path).not.toBe(quarter.props.path);
  });

  it('uses a different path for half notes (value=2)', () => {
    const half = render(<Head value={2} color="red" />).getByTestId(
      'skia-path'
    );
    const quarter = render(<Head value={4} color="red" />).getByTestId(
      'skia-path'
    );
    expect(half.props.path).not.toBe(quarter.props.path);
  });
});

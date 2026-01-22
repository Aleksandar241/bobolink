import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Dot } from './Dot.view';

jest.mock('@shopify/react-native-skia', () =>
  jest.requireActual('./__testUtils__/skiaMock').createSkiaMock()
);

describe('components/Note/Dot', () => {
  it('renders a Path', () => {
    render(<Dot color="red" />);
    expect(screen.getAllByTestId('skia-path')).toHaveLength(1);
  });
});

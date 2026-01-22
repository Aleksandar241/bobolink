import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { Box } from './Box.view';

describe('components/Box/Box', () => {
  it('forwards props to the underlying View', () => {
    render(<Box testID="box" accessibilityLabel="box-label" />);

    expect(screen.getByTestId('box')).toBeTruthy();
    expect(screen.getByLabelText('box-label')).toBeTruthy();
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { createSkiaMock } from '../Note/__testUtils__/skiaMock';

describe('components/Rest/RestDot', () => {
  it('renders a path (default width branch)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      const { RestDot } = jest.requireActual(
        './RestDot.view'
      ) as typeof import('./RestDot.view');
      render(<RestDot value={8} color="#000" />);

      expect(screen.getByTestId('skia-path')).toBeTruthy();
    });
  });

  it('handles missing svg width gracefully (glyphW === null branch)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      jest.doMock('./utils', () => {
        const actual = jest.requireActual('./utils');
        return { ...actual, getRestSvgScaledWidth: () => null };
      });
      const { RestDot } = jest.requireActual(
        './RestDot.view'
      ) as typeof import('./RestDot.view');
      render(<RestDot value={8} color="#000" />);

      expect(screen.getByTestId('skia-path')).toBeTruthy();
    });
  });

  it('hits cached width + path branches on repeated renders', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      const { RestDot } = jest.requireActual(
        './RestDot.view'
      ) as typeof import('./RestDot.view');
      const { rerender } = render(<RestDot value={16} color="#000" />);
      rerender(<RestDot value={16} color="#000" />);

      expect(screen.getByTestId('skia-path')).toBeTruthy();
    });
  });

  it('hits cached-null width branch when svg width is missing', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      jest.doMock('./utils', () => {
        const actual = jest.requireActual('./utils');
        return { ...actual, getRestSvgScaledWidth: () => null };
      });
      const { RestDot } = jest.requireActual(
        './RestDot.view'
      ) as typeof import('./RestDot.view');
      const { rerender } = render(<RestDot value={8} color="#000" />);
      rerender(<RestDot value={8} color="#000" />);

      expect(screen.getByTestId('skia-path')).toBeTruthy();
    });
  });
});

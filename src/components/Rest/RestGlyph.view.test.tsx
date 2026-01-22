import React from 'react';

import { render, screen } from '@testing-library/react-native';

import { createSkiaMock } from '../Note/__testUtils__/skiaMock';

describe('components/Rest/RestGlyph', () => {
  it('renders svg-derived paths when available (array branch)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      const { RestGlyph } = jest.requireActual(
        './RestGlyph.view'
      ) as typeof import('./RestGlyph.view');
      render(<RestGlyph value={8} color="#000" />);

      expect(screen.getByTestId('skia-group')).toBeTruthy();
      expect(screen.getAllByTestId('skia-path').length).toBeGreaterThan(0);
    });
  });

  it('falls back to built-in glyphs when svg paths are unavailable (value 1/2 branch)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      jest.doMock('./utils', () => {
        const actual = jest.requireActual('./utils');
        return { ...actual, getRestSvgScaledPaths: () => null };
      });
      const { RestGlyph } = jest.requireActual(
        './RestGlyph.view'
      ) as typeof import('./RestGlyph.view');
      render(<RestGlyph value={1} color="#000" />);

      expect(screen.getByTestId('skia-group')).toBeTruthy();
      expect(screen.getAllByTestId('skia-path').length).toBeGreaterThan(0);
    });
  });

  it('falls back to built-in non-group glyphs when svg paths are unavailable (value 4 path branch)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => createSkiaMock());
      jest.doMock('./utils', () => {
        const actual = jest.requireActual('./utils');
        return { ...actual, getRestSvgScaledPaths: () => null };
      });
      const { RestGlyph } = jest.requireActual(
        './RestGlyph.view'
      ) as typeof import('./RestGlyph.view');
      render(<RestGlyph value={4} color="#000" />);

      expect(screen.getByTestId('skia-path')).toBeTruthy();
    });
  });
});

describe('components/Rest/utils (branch cases)', () => {
  it('returns null when SVG parsing yields no paths (bases.length === 0)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => {
        type MockMatrix = {
          translate: (x: number, y: number) => MockMatrix;
          scale: (sx: number, sy: number) => MockMatrix;
          rotate: (radians: number) => MockMatrix;
        };

        const makeMockPath = () => ({
          computeTightBounds: () => ({ x: 0, y: 0, width: 1, height: 1 }),
          getBounds: () => ({ x: 0, y: 0, width: 1, height: 1 }),
          copy() {
            return this;
          },
          transform() {
            return this;
          },
        });

        return {
          Skia: {
            Path: {
              Make: () => makeMockPath(),
              MakeFromSVGString: () => null,
              MakeFromOp: () => makeMockPath(),
            },
            Matrix: () => {
              const m: MockMatrix = {
                translate: () => m,
                scale: () => m,
                rotate: () => m,
              };
              return m;
            },
          },
          PathOp: { Difference: 'Difference' },
        };
      });

      const { getRestSvgScaledWidth, getRestSvgScaledPaths } =
        jest.requireActual('./utils') as typeof import('./utils');
      expect(getRestSvgScaledWidth(8, 10)).toBeNull();
      expect(getRestSvgScaledPaths(8, 10, 10, 2)).toBeNull();
    });
  });

  it('returns null when bounds are not finite (no valid bounds from paths)', () => {
    jest.isolateModules(() => {
      jest.doMock('@shopify/react-native-skia', () => {
        type MockMatrix = {
          translate: (x: number, y: number) => MockMatrix;
          scale: (sx: number, sy: number) => MockMatrix;
          rotate: (radians: number) => MockMatrix;
        };

        const makeMockPath = () => ({
          computeTightBounds: () => null,
          getBounds: () => null,
          copy() {
            return this;
          },
          transform() {
            return this;
          },
        });

        return {
          Skia: {
            Path: {
              Make: () => makeMockPath(),
              MakeFromSVGString: () => makeMockPath(),
              MakeFromOp: () => makeMockPath(),
            },
            Matrix: () => {
              const m: MockMatrix = {
                translate: () => m,
                scale: () => m,
                rotate: () => m,
              };
              return m;
            },
          },
          PathOp: { Difference: 'Difference' },
        };
      });

      const { getRestSvgScaledWidth, getRestSvgScaledPaths } =
        jest.requireActual('./utils') as typeof import('./utils');
      expect(getRestSvgScaledWidth(8, 10)).toBeNull();
      expect(getRestSvgScaledPaths(8, 10, 10, 2)).toBeNull();
    });
  });
});

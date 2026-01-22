import { REST_SVG_SCALE_BY_VALUE } from './restSvg';
import { getRestSvgScaledPaths, getRestSvgScaledWidth } from './utils';

describe('components/Rest/utils', () => {
  it('getRestSvgScaledWidth returns null for values without SVG path', () => {
    expect(getRestSvgScaledWidth(1, 10)).toBeNull();
    expect(getRestSvgScaledWidth(2, 10)).toBeNull();
  });

  it('getRestSvgScaledWidth scales width based on target height and scale factor', () => {
    const targetH = 50;
    const expected = targetH * (REST_SVG_SCALE_BY_VALUE[8] ?? 1);
    expect(getRestSvgScaledWidth(8, targetH)).toBeCloseTo(expected, 8);
  });

  it('getRestSvgScaledPaths returns null for values without SVG path', () => {
    expect(getRestSvgScaledPaths(1, 10, 10, 2)).toBeNull();
    expect(getRestSvgScaledPaths(2, 10, 10, 2)).toBeNull();
  });

  it('getRestSvgScaledPaths returns an array for a value with SVG path', () => {
    const first = getRestSvgScaledPaths(8, 20, 20, 2);
    const second = getRestSvgScaledPaths(8, 20, 20, 2);
    expect(Array.isArray(first)).toBe(true);
    expect(Array.isArray(second)).toBe(true);
  });
});

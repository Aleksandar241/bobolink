import { renderHook } from '@testing-library/react-native';

import {
  REST_DOT_EXTRA_WIDTH,
  REST_HEIGHT,
  REST_SMALL_HEIGHT,
  REST_WIDE_GLYPH_WIDTH,
  REST_WIDTH,
  restHeightForValue,
  restWidthForValue,
  useViewModel,
} from './useViewModel';

describe('components/Rest/useViewModel', () => {
  it('restHeightForValue returns small height for 1/2 and full height otherwise', () => {
    expect(restHeightForValue(1)).toBe(REST_SMALL_HEIGHT);
    expect(restHeightForValue(2)).toBe(REST_SMALL_HEIGHT);
    expect(restHeightForValue(4)).toBe(REST_HEIGHT);
    expect(restHeightForValue(8)).toBe(REST_HEIGHT);
    expect(restHeightForValue(16)).toBe(REST_HEIGHT);
  });

  it('restWidthForValue returns base width and accounts for dot', () => {
    expect(restWidthForValue(1, false)).toBe(REST_WIDTH);
    expect(restWidthForValue(2, false)).toBe(REST_WIDTH);
    expect(restWidthForValue(4, false)).toBe(REST_WIDE_GLYPH_WIDTH);
    expect(restWidthForValue(8, false)).toBe(REST_WIDE_GLYPH_WIDTH);
    expect(restWidthForValue(16, false)).toBe(REST_WIDE_GLYPH_WIDTH);

    expect(restWidthForValue(1, true)).toBe(REST_WIDTH + REST_DOT_EXTRA_WIDTH);
    expect(restWidthForValue(4, true)).toBe(
      REST_WIDE_GLYPH_WIDTH + REST_DOT_EXTRA_WIDTH
    );
  });

  it('useViewModel returns theme color and size style', () => {
    const { result } = renderHook(() =>
      useViewModel({ value: 8, withDot: true })
    );
    expect(result.current.color).toBeTruthy();
    expect(result.current.style).toEqual({
      width: restWidthForValue(8, true),
      height: restHeightForValue(8),
    });
  });
});

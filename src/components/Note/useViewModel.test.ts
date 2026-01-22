import { renderHook } from '@testing-library/react-native';

import { STEAM_HEIGHT } from './Stem.view';
import { useViewModel } from './useViewModel';

describe('components/Note/useViewModel', () => {
  it('returns stable layout objects for same inputs (cached)', () => {
    const props = {
      value: 8 as const,
      withDot: true,
      withBeam: false,
      direction: 'down' as const,
      hideFlag: false,
      hideStem: false,
    };

    const a = renderHook(() => useViewModel(props)).result.current;
    const b = renderHook(() => useViewModel(props)).result.current;

    expect(a.style).toBe(b.style);
    expect(a.groupStyle).toBe(b.groupStyle);
    expect(a.groupStyle.transform).toBe(b.groupStyle.transform);
  });

  it('computes showStem/showFlag and group transform based on inputs', () => {
    const a = renderHook(() =>
      useViewModel({ value: 1, direction: 'down', withDot: false })
    ).result.current;
    expect(a.showStem).toBe(false);
    expect(a.showFlag).toBe(false);
    expect(a.groupStyle.transform).toEqual([]);

    const b = renderHook(() =>
      useViewModel({ value: 8, direction: 'down', withDot: false })
    ).result.current;
    expect(b.showStem).toBe(true);
    expect(b.showFlag).toBe(true);
    expect(b.groupStyle.transform).toEqual([{ translateY: STEAM_HEIGHT }]);

    const c = renderHook(() =>
      useViewModel({
        value: 8,
        direction: 'down',
        hideStem: true,
        withDot: false,
      })
    ).result.current;
    expect(c.showStem).toBe(false);
    expect(c.groupStyle.transform).toEqual([]);
  });
});

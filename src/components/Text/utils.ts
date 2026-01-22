import type { TextProps } from './types';

export function memoization(
  prevProps: Readonly<TextProps>,
  nextProps: Readonly<TextProps>
) {
  if (prevProps.style !== nextProps.style) return false;

  const prevChildren = prevProps.children;
  const nextChildren = nextProps.children;

  if (!prevChildren && !nextChildren) return true;

  if (!prevChildren || !nextChildren) return false;

  if (typeof prevChildren !== typeof nextChildren) return false;

  if (typeof prevChildren === 'string') {
    return prevChildren === nextChildren;
  }

  if (typeof prevChildren !== 'object') return false;

  if (prevChildren === null || nextChildren === null) return false;

  const prevHasId = 'id' in (prevChildren as Record<string, unknown>);
  const nextHasId = 'id' in (nextChildren as Record<string, unknown>);
  if (prevHasId !== nextHasId) return false;

  if (
    prevHasId &&
    nextHasId &&
    (prevChildren as Record<string, unknown>).id !==
      (nextChildren as Record<string, unknown>).id
  ) {
    return false;
  }

  const prevHasParams = 'params' in (prevChildren as Record<string, unknown>);
  const nextHasParams = 'params' in (nextChildren as Record<string, unknown>);
  if (prevHasParams !== nextHasParams) return false;

  if (prevHasParams && nextHasParams) {
    const prevParams = (prevChildren as Record<string, unknown>).params as
      | Record<string, unknown>
      | undefined;
    const nextParams = (nextChildren as Record<string, unknown>).params as
      | Record<string, unknown>
      | undefined;

    if (!prevParams && !nextParams) return true;

    if (!prevParams || !nextParams) return false;

    const prevKeys = Object.keys(prevParams);
    const nextKeys = Object.keys(nextParams);
    if (prevKeys.length !== nextKeys.length) return false;

    for (const key of prevKeys) {
      if (prevParams[key] !== nextParams[key]) {
        return false;
      }
    }
  }

  return true;
}

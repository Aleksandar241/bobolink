import { Skia } from '@shopify/react-native-skia';

import { REST_SVG_PATH_D_BY_VALUE, REST_SVG_SCALE_BY_VALUE } from './restSvg';

import type { Bounds, RestValue, SkPath } from './types';

const BASE_PATHS_CACHE = new Map<RestValue, SkPath[] | null>();
const UNION_BOUNDS_CACHE = new Map<RestValue, Bounds | null>();

type Rect = Readonly<{ x: number; y: number; width: number; height: number }>;
type PathBoundsProvider = Readonly<{
  computeTightBounds?: () => Rect;
  getBounds?: () => Rect;
}>;

function getPathBounds(p: SkPath): Rect | null {
  const provider = p as unknown as PathBoundsProvider;
  return provider.computeTightBounds?.() ?? provider.getBounds?.() ?? null;
}

function splitSvgPathToSubpaths(d: string): string[] {
  const parts = d
    .split(/(?=M)/g)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [d];
}

function makeBasePathsFromValue(value: RestValue) {
  if (BASE_PATHS_CACHE.has(value)) {
    return BASE_PATHS_CACHE.get(value)!;
  }

  const d = REST_SVG_PATH_D_BY_VALUE[value];
  if (!d) {
    BASE_PATHS_CACHE.set(value, null);
    return null;
  }

  const parts = splitSvgPathToSubpaths(d);
  const bases = parts
    .map((sp) => Skia.Path.MakeFromSVGString(sp))
    .filter((p): p is SkPath => Boolean(p));

  if (bases.length === 0) {
    BASE_PATHS_CACHE.set(value, null);
    return null;
  }

  BASE_PATHS_CACHE.set(value, bases);
  return bases;
}

function getUnionTightBounds(paths: SkPath[]): Bounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of paths) {
    const r = getPathBounds(p);
    if (!r) continue;
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  }

  if (
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  ) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

function getUnionBoundsForValue(value: RestValue) {
  if (UNION_BOUNDS_CACHE.has(value)) {
    return UNION_BOUNDS_CACHE.get(value)!;
  }

  const bases = makeBasePathsFromValue(value);
  if (!bases) {
    UNION_BOUNDS_CACHE.set(value, null);
    return null;
  }

  const bounds = getUnionTightBounds(bases);
  UNION_BOUNDS_CACHE.set(value, bounds);
  return bounds;
}

export function getRestSvgScaledWidth(value: RestValue, targetH: number) {
  const bounds = getUnionBoundsForValue(value);
  if (!bounds) return null;

  const boundsW = Math.max(1e-6, bounds.maxX - bounds.minX);
  const boundsH = Math.max(1e-6, bounds.maxY - bounds.minY);
  const s = (targetH / boundsH) * (REST_SVG_SCALE_BY_VALUE[value] ?? 1);
  return boundsW * s;
}

export function getRestSvgScaledPaths(
  value: RestValue,
  targetW: number,
  targetH: number,
  pad: number
) {
  const bases = makeBasePathsFromValue(value);
  if (!bases) return null;

  const bounds = getUnionBoundsForValue(value);
  if (!bounds) return null;

  const boundsW = Math.max(1e-6, bounds.maxX - bounds.minX);
  const boundsH = Math.max(1e-6, bounds.maxY - bounds.minY);
  const s = (targetH / boundsH) * (REST_SVG_SCALE_BY_VALUE[value] ?? 1);

  const scaledW = boundsW * s;
  const scaledH = boundsH * s;
  const tx = pad + (targetW - scaledW) / 2;
  const ty = pad + (targetH - scaledH) / 2;

  const matrix = Skia.Matrix()
    .translate(tx, ty)
    .scale(s, s)
    .translate(-bounds.minX, -bounds.minY);

  const out: SkPath[] = [];
  for (const base of bases) {
    out.push(base.copy().transform(matrix));
  }

  return out;
}

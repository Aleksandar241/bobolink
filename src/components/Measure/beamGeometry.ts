import { Skia } from '@shopify/react-native-skia';

import {
  BEAM_HEIGHT,
  BEAM_SECONDARY_HEIGHT,
  BEAM_SPACING,
} from '../Note/Beam.view';
import {
  DOWN_STEM_X,
  STEAM_HEIGHT,
  STEM_WIDTH,
  STEM_Y,
  UP_STEM_X,
} from '../Note/Stem.view';

import { addSlantedRectPath, clampNumber, getLineY } from './pathMath';

import type { BeamLine, BeamPath, MeasureEvent, StemPath } from './types';

export function computeBeamLines({
  groups,
  xOffsets,
  yOffsets,
  directionByIndex,
}: {
  groups: readonly (readonly number[])[];
  xOffsets: readonly number[];
  yOffsets: readonly number[];
  directionByIndex: readonly ('up' | 'down')[];
}): BeamLine[] {
  const out: BeamLine[] = [];
  for (let gi = 0; gi < groups.length; gi += 1) {
    const g = groups[gi]!;

    const firstIndex = g[0]!;
    const d = directionByIndex[firstIndex]!;
    const stemX = d === 'down' ? DOWN_STEM_X : UP_STEM_X;

    const xs = g.map((idx) => xOffsets[idx]! + stemX);
    const stemEndYs = g.map((idx) => {
      const top = yOffsets[idx]!;
      const localY = d === 'up' ? STEM_Y + STEAM_HEIGHT : STEM_Y;
      return top + localY;
    });

    const xFirst = xs[0]!;
    const xLast = xs[xs.length - 1]!;
    const yFirst = stemEndYs[0]!;
    const yLast = stemEndYs[stemEndYs.length - 1]!;

    const dx = xLast - xFirst;
    let m = dx !== 0 ? (yLast - yFirst) / dx : 0;
    m = clampNumber(m, -0.35, 0.35);

    const candidates = stemEndYs.map((yy, i) => yy - m * xs[i]!);
    const b = d === 'down' ? Math.min(...candidates) : Math.max(...candidates);

    out.push({ m, b, direction: d, stemX });
  }
  return out;
}

export function computeBeamPaths({
  events,
  groups,
  beamLines,
  xOffsets,
}: {
  events: readonly MeasureEvent[];
  groups: readonly (readonly number[])[];
  beamLines: readonly BeamLine[];
  xOffsets: readonly number[];
}): BeamPath[] {
  const paths: BeamPath[] = [];
  for (let gi = 0; gi < groups.length; gi += 1) {
    const g = groups[gi]!;
    const line = beamLines[gi]!;
    const { stemX } = line;

    const first = g[0]!;
    const last = g[g.length - 1]!;

    const xStart = xOffsets[first]! + stemX;
    const xEnd = xOffsets[last]! + stemX + STEM_WIDTH;
    const width = Math.max(0, xEnd - xStart);
    if (width <= 0) continue;

    const yStart = getLineY(line, xStart);
    const yEnd = getLineY(line, xEnd);

    const p1 = Skia.Path.Make();
    addSlantedRectPath(p1, xStart, yStart, xEnd, yEnd, BEAM_HEIGHT);
    paths.push({ path: p1, key: `beam-${gi}-1` });

    const is16 = g.map(
      (idx) => events[idx]!.kind === 'note' && events[idx]!.value === 16
    );
    const hasAny16 = is16.some(Boolean);
    if (!hasAny16) continue;

    const stemStartX = g.map((idx) => xOffsets[idx]! + stemX);
    const stemEndX = stemStartX.map((x) => x + STEM_WIDTH);
    const d = line.direction;
    const yOffset2 = d === 'up' ? -BEAM_SPACING : BEAM_SPACING;

    const inRun = Array(g.length).fill(false) as boolean[];
    for (let p = 0; p < g.length; p += 1) {
      if (!is16[p]) continue;
      let q = p;
      while (q + 1 < g.length && is16[q + 1]) q += 1;
      const runLen = q - p + 1;
      if (runLen >= 2) {
        for (let t = p; t <= q; t += 1) inRun[t] = true;
        const sx = stemStartX[p]!;
        const ex = stemEndX[q]!;
        const w = ex - sx;
        if (w > 0) {
          const y1 = getLineY(line, sx) + yOffset2;
          const y2 = getLineY(line, ex) + yOffset2;
          const p2 = Skia.Path.Make();
          addSlantedRectPath(p2, sx, y1, ex, y2, BEAM_SECONDARY_HEIGHT);
          paths.push({ path: p2, key: `beam-${gi}-2-run-${p}-${q}` });
        }
      }
      p = q;
    }

    for (let p = 0; p < g.length; p += 1) {
      if (!is16[p] || inRun[p]) continue;

      if (p + 1 < g.length) {
        const mid = (stemEndX[p]! + stemStartX[p + 1]!) / 2;
        const sx = stemStartX[p]!;
        const ex = mid;
        const w = ex - sx;
        if (w > 0) {
          const y1 = getLineY(line, sx) + yOffset2;
          const y2 = getLineY(line, ex) + yOffset2;
          const p2 = Skia.Path.Make();
          addSlantedRectPath(p2, sx, y1, ex, y2, BEAM_SECONDARY_HEIGHT);
          paths.push({ path: p2, key: `beam-${gi}-2-halfR-${p}` });
        }
      }

      if (p - 1 >= 0) {
        const mid = (stemEndX[p - 1]! + stemStartX[p]!) / 2;
        const sx = mid;
        const ex = stemEndX[p]!;
        const w = ex - sx;
        if (w > 0) {
          const y1 = getLineY(line, sx) + yOffset2;
          const y2 = getLineY(line, ex) + yOffset2;
          const p2 = Skia.Path.Make();
          addSlantedRectPath(p2, sx, y1, ex, y2, BEAM_SECONDARY_HEIGHT);
          paths.push({ path: p2, key: `beam-${gi}-2-halfL-${p}` });
        }
      }
    }
  }
  return paths;
}

export function computeStemPaths({
  events,
  groups,
  beamLines,
  xOffsets,
  yOffsets,
}: {
  events: readonly MeasureEvent[];
  groups: readonly (readonly number[])[];
  beamLines: readonly BeamLine[];
  xOffsets: readonly number[];
  yOffsets: readonly number[];
}): StemPath[] {
  const paths: StemPath[] = [];
  for (let gi = 0; gi < groups.length; gi += 1) {
    const g = groups[gi]!;
    const line = beamLines[gi]!;
    const { direction: d, stemX } = line;

    for (const idx of g) {
      const e = events[idx]!;
      if (e.kind !== 'note') continue;

      const top = yOffsets[idx]!;
      const x = xOffsets[idx]! + stemX;
      const connectY =
        d === 'down' ? getLineY(line, x) + BEAM_HEIGHT : getLineY(line, x);

      const baseStemTop = top + STEM_Y;
      const baseStemBottom = top + STEM_Y + STEAM_HEIGHT;

      const y = d === 'down' ? connectY : baseStemTop;
      const height =
        d === 'down' ? baseStemBottom - connectY : connectY - baseStemTop;

      if (!Number.isFinite(height) || height <= 0) continue;

      const p = Skia.Path.Make();
      p.addRect({ x, y, width: STEM_WIDTH, height });
      paths.push({ path: p, key: `stem-${gi}-${idx}` });
    }
  }
  return paths;
}

import { BeamLine } from './types';

import type { SkPath } from '@shopify/react-native-skia';

export function clampNumber(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function getLineY(line: BeamLine, x: number): number {
  return line.m * x + line.b;
}

export function addSlantedRectPath(
  path: SkPath,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness: number
): void {
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x2, y2 + thickness);
  path.lineTo(x1, y1 + thickness);
  path.close();
}

export function addOrientedQuad(
  path: SkPath,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tx: number,
  ty: number
): void {
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x2 + tx, y2 + ty);
  path.lineTo(x1 + tx, y1 + ty);
  path.close();
}

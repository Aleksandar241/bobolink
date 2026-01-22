export const CLEF_GAP_X = -2;

export type Clef = keyof typeof CLEF_CONFIG;

export type StaffReference = Readonly<{
  letter: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
  octave: number;
}>;

export type KeySignaturePlacement = Readonly<{
  sharpStepsFromTop: readonly number[];
  flatStepsFromTop: readonly number[];
  sharpYTweaksPx?: readonly number[];
  sharpAnchorY: number;
  flatAnchorY: number;
}>;

export type ClefConfig = Readonly<{
  iconSize: number;
  clefDownShiftPx: number;
  staffReference: StaffReference;
  keySignature: KeySignaturePlacement;
}>;

const CLEF_CONFIG = {
  treble: {
    iconSize: 48,
    clefDownShiftPx: 5,
    staffReference: { letter: 'b', octave: 4 },
    keySignature: {
      sharpStepsFromTop: [0.5, 4, -0.5, 2, 5, 2.5, 5.5],
      flatStepsFromTop: [3.5, 0.5, 4.5, 1.5, 5.5, 2.5, 6.5],
      sharpYTweaksPx: [0, 0, 0, +3, +3, -4, -4],
      sharpAnchorY: 0.5,
      flatAnchorY: 0.7,
    },
  },
  bass: {
    iconSize: 40,
    clefDownShiftPx: -2,
    staffReference: { letter: 'd', octave: 3 },
    keySignature: {
      sharpStepsFromTop: [2.5, 5.5, 1.5, 4, 7, 4.5, 7.5],
      flatStepsFromTop: [5.5, 2.5, 6.5, 3.5, 7.5, 4.5, 8.5],
      sharpYTweaksPx: [0, 0, 0, +3, +3, -4, -4],
      sharpAnchorY: 0.5,
      flatAnchorY: 0.7,
    },
  },
} satisfies Record<string, ClefConfig>;

export function getClefConfig(clef: Clef): ClefConfig {
  return CLEF_CONFIG[clef];
}

export function clefIconSize(clef: Clef): number {
  return getClefConfig(clef).iconSize;
}

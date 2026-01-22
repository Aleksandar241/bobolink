import { NoteModel, NoteValue } from '../Note';
import { RestModel } from '../Rest';

import { Clef } from './clefConfig';

import type { SkPath } from '@shopify/react-native-skia';

export type TimeSignature = {
  beats: number;
  beatValue: NoteValue;
};

export type MeasureEvent = NoteModel | RestModel;

export type BeamingContext = Readonly<{
  measureTicks: number;
  beatTicks: number;
}>;

export type BeamingState = {
  posInMeasure: number;
  currentGroupStart: number | null;
  groups: number[][];
};

export type MeasureLayoutMeta = Readonly<{
  totalWidth: number;
  totalHeight: number;
}>;

export type BarlinePaths = Readonly<{
  left: SkPath;
  right: SkPath;
}>;

export type MeasureDirection = 'auto' | 'up' | 'down';

export type MeasureProps = ViewModelProps &
  Readonly<{
    isStart?: boolean;
    isEnd?: boolean;
    showLeftBarline?: boolean;
    showRightBarline?: boolean;
    showTimeSignature?: boolean;
    showClef?: boolean;
  }>;

export type ViewModelProps = Readonly<{
  events: readonly MeasureEvent[];
  timeSignature: TimeSignature;
  clef?: Clef;
  sharps?: number;
  flats?: number;
  noteSpacing?: number;
  direction?: MeasureDirection;
  stemThresholdMidi?: number;
  isStart?: boolean;
  isEnd?: boolean;
  showTimeSignature?: boolean;
  showClef?: boolean;
}>;

export type Layout = Readonly<{
  widths: number[];
  xOffsets: number[];
  totalWidth: number;
  totalHeight: number;
}>;

export type BeamPath = Readonly<{ path: SkPath; key: string }>;
export type StaffPath = Readonly<{ path: SkPath; key: string }>;
export type StemPath = Readonly<{ path: SkPath; key: string }>;
export type LedgerLinePath = Readonly<{ path: SkPath; key: string }>;
export type TripletPath = Readonly<{ path: SkPath; key: string }>;

export type BeamLine = Readonly<{
  m: number;
  b: number;
  direction: Exclude<MeasureDirection, 'auto'>;
  stemX: number;
}>;

export type {
  Clef,
  ClefConfig,
  KeySignaturePlacement,
  StaffReference,
} from './clefConfig';

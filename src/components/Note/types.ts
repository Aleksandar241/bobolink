import type { Transforms3d } from '@shopify/react-native-skia';

type NoteValue = 1 | 2 | 4 | 8 | 16;

type Direction = 'up' | 'down';

export type NoteProps = Readonly<ViewModelProps & {}>;

export type ViewModelProps = Readonly<{
  value: NoteValue;
  withDot?: boolean;
  withTriplet?: boolean;
  withBeam?: boolean;
  hideFlag?: boolean;
  hideStem?: boolean;
  direction?: Direction;
}>;

export type HeadProps = Readonly<{
  value: NoteValue;
  color: string;
}>;

export type DotProps = Readonly<{
  color: string;
}>;

export type StemProps = Readonly<{
  direction?: Direction;
  color?: string;
}>;

export type FlagProps = Readonly<{
  direction?: Direction;
  color: string;
  value: NoteValue;
}>;

export type BeamProps = Readonly<{
  color?: string;
  value: NoteValue;
  direction?: Direction;
}>;

export type Layout = Readonly<{
  showStem: boolean;
  showFlag: boolean;
  style: Readonly<{ width: number; height: number }>;
  groupStyle: Readonly<{ transform: Transform }>;
}>;

export type Transform = Transforms3d;

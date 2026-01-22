import { type Skia } from '@shopify/react-native-skia';

export type RestValue = 1 | 2 | 4 | 8 | 16;

export type RestProps = Readonly<ViewModelProps & {}>;

export type ViewModelProps = Readonly<{
  value: RestValue;
  withDot?: boolean;
}>;

export type GlyphProps = Readonly<{
  value: RestValue;
  color: string;
}>;

export type SkPath = ReturnType<typeof Skia.Path.Make>;

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

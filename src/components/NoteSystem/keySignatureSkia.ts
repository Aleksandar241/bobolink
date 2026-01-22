import { Skia } from '@shopify/react-native-skia';

export const SHARP_VIEWBOX = Object.freeze({ width: 24, height: 24 });
export const FLAT_VIEWBOX = Object.freeze({ width: 64, height: 128 });

const SHARP_D =
  'M8.6 4h1.8v16H8.6V4Zm4.8 0h1.8v16h-1.8V4ZM5 13 18 6 19.2 8 6.2 15Z M5 18.5 18 11.5 19.2 13.5 6.2 20.5Z';

const FLAT_D =
  'M28 30C28 28 30 26 32 26C34 26 36 28 36 30V82C46 80 56 86 56 96C56 110 42 120 28 120ZM36 88V112C44 110 48 104 48 96C48 88 44 86 36 88Z';

export const SHARP_PATH = Skia.Path.MakeFromSVGString(SHARP_D)!;
export const FLAT_PATH = Skia.Path.MakeFromSVGString(FLAT_D)!;

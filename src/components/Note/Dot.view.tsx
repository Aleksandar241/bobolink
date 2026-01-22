import { Path, Skia } from '@shopify/react-native-skia';

import { HEAD_WIDTH } from './Head.view';
import { DotProps } from './types';

export const DOT_WIDTH = HEAD_WIDTH / 3;
export const DOT_HEIGHT = DOT_WIDTH;
export const DOT_SPACING = DOT_WIDTH;

const path = Skia.Path.Make();
path.addOval({
  x: 4 * DOT_SPACING,
  y: DOT_SPACING / 2,
  width: DOT_WIDTH,
  height: DOT_HEIGHT,
});

export const Dot: React.FC<DotProps> = ({ color }) => {
  return <Path path={path} color={color} />;
};

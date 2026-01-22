import React from 'react';

import { View } from 'react-native';

export function createSkiaMock() {
  type MockRect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  type MockPath = {
    addRect: (r: unknown) => MockPath;
    addOval: (r: unknown) => MockPath;
    addPath: (p: unknown) => MockPath;
    moveTo: (x: number, y: number) => MockPath;
    lineTo: (x: number, y: number) => MockPath;
    cubicTo: (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ) => MockPath;
    close: () => MockPath;
    copy: () => MockPath;
    transform: (m: unknown) => MockPath;
    computeTightBounds: () => MockRect;
    getBounds: () => MockRect;
  };

  type MockMatrix = {
    translate: (x: number, y: number) => MockMatrix;
    scale: (sx: number, sy: number) => MockMatrix;
    rotate: (radians: number) => MockMatrix;
  };

  const makeMockPath = () => {
    const p: MockPath = {
      addRect: () => p,
      addOval: () => p,
      addPath: () => p,
      moveTo: () => p,
      lineTo: () => p,
      cubicTo: () => p,
      close: () => p,
      copy: () => p,
      transform: () => p,
      computeTightBounds: () => ({ x: 0, y: 0, width: 1, height: 1 }),
      getBounds: () => ({ x: 0, y: 0, width: 1, height: 1 }),
    };
    return p;
  };

  type PassThroughViewProps = React.ComponentProps<typeof View>;

  const Path = (props: PassThroughViewProps) => (
    <View testID="skia-path" {...props} />
  );
  const Group = ({
    children,
    ...props
  }: React.PropsWithChildren<
    PassThroughViewProps & Readonly<{ transform?: unknown }>
  >) => (
    <View testID="skia-group" {...props}>
      {children}
    </View>
  );
  const Canvas = ({
    children,
    ...props
  }: React.PropsWithChildren<PassThroughViewProps>) => (
    <View testID="skia-canvas" {...props}>
      {children}
    </View>
  );

  const Skia = {
    Path: {
      Make: () => makeMockPath(),
      MakeFromSVGString: () => makeMockPath(),
      MakeFromOp: () => makeMockPath(),
    },
    Matrix: () => {
      const m: MockMatrix = {
        translate: () => m,
        scale: () => m,
        rotate: () => m,
      };
      return m;
    },
  };

  const PathOp = { Difference: 'Difference' };

  return { Canvas, Group, Path, Skia, PathOp };
}

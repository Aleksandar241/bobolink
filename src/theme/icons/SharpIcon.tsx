import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

import { Icon, IconProps } from '@/src/components/Icon';

import type { SvgProps } from 'react-native-svg';
const SVGIcon = (props: SvgProps) => (
  <Svg
    fill="currentColor"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    {...props}
  >
    <Path d="M8.6 4h1.8v16H8.6V4Zm4.8 0h1.8v16h-1.8V4ZM5 13 18 6 19.2 8 6.2 15Z M5 18.5 18 11.5 19.2 13.5 6.2 20.5Z" />
  </Svg>
);
export const IconSharpIcon = (props: Omit<IconProps, 'Icon'>) => {
  return <Icon {...props} Icon={SVGIcon} />;
};

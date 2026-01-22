import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

import { Icon, IconProps } from '@/src/components/Icon';

import type { SvgProps } from 'react-native-svg';
const SVGIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 64 128" width={24} height={24} {...props}>
    <Path
      fill="currentColor"
      d="M28 30C28 28 30 26 32 26C34 26 36 28 36 30V82C46 80 56 86 56 96C56 110 42 120 28 120ZM36 88V112C44 110 48 104 48 96C48 88 44 86 36 88Z"
    />
  </Svg>
);
export const IconFlatIcon = (props: Omit<IconProps, 'Icon'>) => {
  return <Icon {...props} Icon={SVGIcon} />;
};

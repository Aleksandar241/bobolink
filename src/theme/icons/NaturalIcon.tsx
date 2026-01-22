import * as React from 'react';

import Svg, { Path } from 'react-native-svg';

import { Icon, IconProps } from '@/src/components/Icon';

import type { SvgProps } from 'react-native-svg';
const SVGIcon = (props: SvgProps) => (
  <Svg
    fill="currentColor"
    viewBox="0 0 460.691 460.691"
    width={24}
    height={24}
    {...props}
  >
    <Path d="M266.155 97.696c.007-9.028-10.874-13.274-17.071-7.076l-34.548 34.547V10c0-5.522-4.478-10-10-10s-10 4.478-10 10v352.995c-.006 8.687 10.603 13.506 17.071 7.076l34.548-34.547v115.167c0 5.522 4.478 10 10 10s10-4.478 10-10zm-20 155.543-31.619 31.619v-77.406l31.619-31.619zm0-131.406v25.715l-31.619 31.619v-25.715zm-31.619 217.025v-25.715l31.619-31.619v25.715z" />
  </Svg>
);
export const IconNaturalIcon = (props: Omit<IconProps, 'Icon'>) => {
  return <Icon {...props} Icon={SVGIcon} />;
};

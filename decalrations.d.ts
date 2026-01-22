declare namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string;
    BUNDLE_ID: string;
  }
}

declare module '*.svg' {
  import React from 'react';

  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

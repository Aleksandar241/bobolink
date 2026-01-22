import { StyleProp, TextStyle } from 'react-native';

import type { TranslationKey, TranslationValues } from '@/src/localization';

export type TextProps = Readonly<{
  style?: StyleProp<TextStyle>;
}> &
  ViewModelProps;

type TextChildren =
  | React.ReactNode
  | string
  | TranslationKey
  | { id: TranslationKey; params?: TranslationValues };

export type ViewModelProps = Readonly<{
  children: TextChildren;
}>;

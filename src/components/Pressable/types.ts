import type {
  PressableProps as RNPressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type ViewModelProps = Pick<RNPressableProps, 'onPress'> & {
  style?: StyleProp<ViewStyle>;
  throttleTime?: number;
};

export type PressableProps = Readonly<
  Omit<RNPressableProps, 'onPress' | 'style'> &
    ViewModelProps & { throttled?: boolean }
>;

import {
  StyleSheet as UnistyleStyleSheet,
  UnistylesRuntime,
  useUnistyles,
  withUnistyles,
} from 'react-native-unistyles';

import { createStorage } from '@/src/store/createStorage';

import { AppThemes, appThemes } from './colors';

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

export type { AppThemes } from './colors';
export { changeTheme };

const storage = createStorage('theme-storage');

const initialTheme = () => {
  const theme = storage.getString('theme') as
    | keyof typeof appThemes
    | undefined;
  const backgroundColor =
    theme === 'dark'
      ? appThemes.dark.colors.backgroundPrimary
      : appThemes.light.colors.backgroundPrimary;

  UnistylesRuntime.setRootViewBackgroundColor(backgroundColor);

  return theme || 'light';
};

const changeTheme = () => {
  const newTheme = UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark';
  const backgroundColor =
    newTheme === 'dark'
      ? appThemes.dark.colors.backgroundPrimary
      : appThemes.light.colors.backgroundPrimary;
  storage.set('theme', newTheme);
  UnistylesRuntime.setRootViewBackgroundColor(backgroundColor);
  UnistylesRuntime.setTheme(newTheme);
};

const configuration = {
  themes: appThemes,
  settings: {
    initialTheme,
  },
};

export const configure = () => {
  UnistyleStyleSheet.configure(configuration);
};

const getTheme = () => storage.getString('theme');

export {
  UnistyleStyleSheet as StyleSheet,
  getTheme,
  useUnistyles as useStyle,
  withUnistyles as withStyles,
};

export type Colors = typeof appThemes.light.colors;

const light = {
  colors: {
    backgroundPrimary: '#FFFFFF',

    primary: '#ff1ff4',
    secondary: '#1ff4ff',

    textPrimary: '#000000',
  },
  gap: (v: number) => v * 8,
};

const dark: typeof light = {
  colors: {
    backgroundPrimary: '#000000',
    primary: '#1ff4ff',
    secondary: 'blue',

    textPrimary: '#FFFFFF',
  },
  gap: (v: number) => v * 8,
};

export const appThemes = {
  light,
  dark,
};

export type AppThemes = typeof appThemes;

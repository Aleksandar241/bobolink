// Set up global expo winter runtime mock BEFORE anything else
if (typeof global !== 'undefined') {
  global.__ExpoImportMetaRegistry = {};
  // Mock structuredClone which expo winter runtime uses
  if (!global.structuredClone) {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
  }
}

// Mock expo/src/winter modules BEFORE anything else loads
jest.mock('expo/src/winter/runtime.native', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('expo/src/winter/installGlobal', () => ({
  __esModule: true,
  __ExpoImportMetaRegistry: {},
  getValue: jest.fn(() => ({})),
}));

// Mock Skia (JSI bindings not available in Jest)
jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');

  const Canvas = ({ children }) => React.createElement(React.Fragment, null, children);
  const Group = ({ children }) => React.createElement(React.Fragment, null, children);
  const Path = () => null;

  const makeMockPath = () => {
    const p = {
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

  const Skia = {
    Path: {
      Make: () => makeMockPath(),
      MakeFromSVGString: () => makeMockPath(),
      MakeFromOp: () => makeMockPath(),
    },
    Matrix: () => {
      const m = {
        translate: () => m,
        scale: () => m,
        rotate: () => m,
      };
      return m;
    },
  };

  const PathOp = { Difference: 'Difference' };

  return { Canvas, Group, Path, Skia, PathOp };
});

require('react-native-reanimated').setUpTests();

// Mock react-native-nitro-modules
jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {
    get: jest.fn(),
  },
}));

// Mock react-native-unistyles
jest.mock('react-native-unistyles', () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        backgroundPrimary: '#FFFFFF',
        primary: '#ff1ff4',
        secondary: '#1ff4ff',
        textPrimary: '#000000',
      },
    },
  }),
  StyleSheet: {
    create: (fn) => {
      const theme = {
        colors: {
          backgroundPrimary: '#FFFFFF',
          primary: '#ff1ff4',
          secondary: '#1ff4ff',
          textPrimary: '#000000',
        },
      };
      return fn(theme);
    },
  },
  UnistylesRuntime: {
    setRootViewBackgroundColor: jest.fn(),
    setTheme: jest.fn(),
    themeName: 'light',
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (params) {
        return `${key}_${JSON.stringify(params)}`;
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock localization store
jest.mock('@/src/localization/store', () => ({
  useI18nStore: () => ({
    setLanguage: jest.fn(),
  }),
}));

// Mock react-native-mmkv storage
jest.mock('@/src/store/createStorage', () => ({
  createStorage: () => ({
    getString: jest.fn(() => null),
    set: jest.fn(),
    getBoolean: jest.fn(() => false),
    setBoolean: jest.fn(),
  }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

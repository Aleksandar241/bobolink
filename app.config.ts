import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const name = process.env.APP_NAME;
  const bundleIdentifier = process.env.BUNDLE_ID;

  return {
    name,
    slug: 'bobolink',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'bobolink',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      bundleIdentifier,
      supportsTablet: true,
      infoPlist: {
        NSMicrophoneUsageDescription:
          'This app needs access to microphone for audio recording and pitch detection',
      },
    },
    android: {
      package: bundleIdentifier,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './src/assets/images/android-icon-foreground.png',
        backgroundImage: './src/assets/images/android-icon-background.png',
        monochromeImage: './src/assets/images/android-icon-monochrome.png',
      },
      permissions: ['android.permission.RECORD_AUDIO'],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};

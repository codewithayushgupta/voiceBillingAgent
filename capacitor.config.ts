import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voicebilling.app',
  appName: 'Vaani',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP for development/API calls
    allowNavigation: ['*'], // Allow external API calls
  },
  android: {
    allowMixedContent: true, // Allow mixed HTTP/HTTPS content
    captureInput: true, // Better keyboard handling
    webContentsDebuggingEnabled: true, // Enable Chrome DevTools debugging
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4f46e5',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    SpeechRecognition: {
      language: 'hi-IN',
      matches: 5,
      prompt: '', // No popup
      showPopup: false,
      showPartialResults: true,
    },
  },
};

export default config;
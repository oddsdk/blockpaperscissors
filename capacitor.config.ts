import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bps.app',
  appName: 'Block Paper Scissors',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;

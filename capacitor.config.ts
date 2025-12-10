import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.davin.Gymbro', 
  appName: 'Gymbro',       
  webDir: 'www',

  server: {
    androidScheme: 'https'
  }
};

export default config;
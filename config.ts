// app/config.ts
import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.7.185:5043'
    : 'http://localhost:5043';
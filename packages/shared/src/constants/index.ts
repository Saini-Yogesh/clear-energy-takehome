import { Platform } from 'react-native';

export const API_PORT = 4000;

export const getBaseUrl = () => {
  // Android emulator requires 10.0.2.2 to access localhost on host machine
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}`;
  }
  return `http://localhost:${API_PORT}`;
};

export const API_TIMEOUT = 10000; // 10 seconds

export const CACHE_KEYS = {
  ORDERS: 'orders',
  TRIPS: 'trips',
  PENDING_ACTIONS: 'pending-actions',
} as const;
